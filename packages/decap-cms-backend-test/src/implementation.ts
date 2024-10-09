import { attempt, isError, take, unset, isEmpty } from 'lodash';
import { v4 as uuid } from 'uuid';
import {
  EditorialWorkflowError,
  Cursor,
  CURSOR_COMPATIBILITY_SYMBOL,
  basename,
} from 'decap-cms-lib-util';
import { extname, dirname } from 'node:path';

import AuthenticationPage from './AuthenticationPage';

import type {
  Implementation,
  Entry,
  ImplementationEntry,
  AssetProxy,
  PersistOptions,
  User,
  Config,
  ImplementationFile,
  DataFile,
} from 'decap-cms-lib-util';

type RepoFile = { path: string; content: string | AssetProxy };
type RepoTree = { [key: string]: RepoFile | RepoTree };

type Diff = {
  id: string;
  originalPath?: string;
  path: string;
  newFile: boolean;
  status: string;
  content: string | AssetProxy;
};

type UnpublishedRepoEntry = {
  slug: string;
  collection: string;
  status: string;
  diffs: Diff[];
  updatedAt: string;
};

declare global {
  interface Window {
    repoFiles: RepoTree;
    repoFilesUnpublished: { [key: string]: UnpublishedRepoEntry };
  }
}

globalThis.repoFiles = globalThis.repoFiles || {};
globalThis.repoFilesUnpublished = globalThis.repoFilesUnpublished || [];

function getFile(path: string, tree: RepoTree) {
  const segments = path.split('/');
  let obj: RepoTree = tree;
  while (obj && segments.length > 0) {
    obj = obj[segments.shift() as string] as RepoTree;
  }
  return (obj as unknown as RepoFile) || {};
}

function writeFile(path: string, content: string | AssetProxy, tree: RepoTree) {
  const segments = path.split('/');
  let obj = tree;
  while (segments.length > 1) {
    const segment = segments.shift() as string;
    obj[segment] = obj[segment] || {};
    obj = obj[segment] as RepoTree;
  }
  (obj[segments.shift() as string] as RepoFile) = { content, path };
}

function deleteFile(path: string, tree: RepoTree) {
  unset(tree, path.split('/'));
}

const pageSize = 10;

function getCursor(
  folder: string,
  extension: string,
  entries: ImplementationEntry[],
  index: number,
  depth: number,
) {
  const count = entries.length;
  const pageCount = Math.floor(count / pageSize);
  return Cursor.create({
    actions: [
      ...(index < pageCount ? ['next', 'last'] : []),
      ...(index > 0 ? ['prev', 'first'] : []),
    ],
    meta: { index, count, pageSize, pageCount },
    data: { folder, extension, index, pageCount, depth },
  });
}

export function getFolderFiles(
  tree: RepoTree,
  folder: string,
  extension: string,
  depth: number,
  files = [] as RepoFile[],
  path = folder,
) {
  if (depth <= 0) {
    return files;
  }

  for (const key of Object.keys(tree[folder] || {})) {
    if (extname(key)) {
      const file = (tree[folder] as RepoTree)[key] as RepoFile;
      if (!extension || key.endsWith(`.${extension}`)) {
        files.unshift({ content: file.content, path: `${path}/${key}` });
      }
    } else {
      const subTree = tree[folder] as RepoTree;
      getFolderFiles(subTree, key, extension, depth - 1, files, `${path}/${key}`);
      continue;
    }
  }

  return files;
}

export default class TestBackend implements Implementation {
  mediaFolder: string;
  options: { initialWorkflowStatus?: string };

  constructor(config: Config, options = {}) {
    this.options = options;
    this.mediaFolder = config.media_folder;
  }

  isGitBackend() {
    return false;
  }

  status() {
    return Promise.resolve({ auth: { status: true }, api: { status: true, statusPage: '' } });
  }

  authComponent() {
    return AuthenticationPage;
  }

  restoreUser() {
    return this.authenticate();
  }

  authenticate() {
    return Promise.resolve() as unknown as Promise<User>;
  }

  logout() {
    return null;
  }

  getToken() {
    return Promise.resolve('');
  }

  traverseCursor(cursor: Cursor, action: string) {
    const { folder, extension, index, pageCount, depth } = cursor.data!.toObject() as {
      folder: string;
      extension: string;
      index: number;
      pageCount: number;
      depth: number;
    };
    const newIndex = (() => {
      if (action === 'next') {
        return (index as number) + 1;
      }
      if (action === 'prev') {
        return (index as number) - 1;
      }
      if (action === 'first') {
        return 0;
      }
      if (action === 'last') {
        return pageCount;
      }
      return 0;
    })();
    // TODO: stop assuming cursors are for collections
    const allFiles = getFolderFiles(globalThis.repoFiles, folder, extension, depth);
    const allEntries = allFiles.map(f => ({
      data: f.content as string,
      file: { path: f.path, id: f.path },
    }));
    const entries = allEntries.slice(newIndex * pageSize, newIndex * pageSize + pageSize);
    const newCursor = getCursor(folder, extension, allEntries, newIndex, depth);
    return Promise.resolve({ entries, cursor: newCursor });
  }

  entriesByFolder(folder: string, extension: string, depth: number) {
    const files = folder ? getFolderFiles(globalThis.repoFiles, folder, extension, depth) : [];
    const entries = files.map(f => ({
      data: f.content as string,
      file: { path: f.path, id: f.path },
    }));
    const cursor = getCursor(folder, extension, entries, 0, depth);
    const ret = take(entries, pageSize);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ret[CURSOR_COMPATIBILITY_SYMBOL] = cursor;
    return Promise.resolve(ret);
  }

  entriesByFiles(files: ImplementationFile[]) {
    return Promise.all(
      files.map(file => ({
        file,
        data: getFile(file.path, globalThis.repoFiles).content as string,
      })),
    );
  }

  getEntry(path: string) {
    return Promise.resolve({
      file: { path, id: null },
      data: getFile(path, globalThis.repoFiles).content as string,
    });
  }

  unpublishedEntries() {
    return Promise.resolve(Object.keys(globalThis.repoFilesUnpublished));
  }

  unpublishedEntry({ id, collection, slug }: { id?: string; collection?: string; slug?: string }) {
    if (id) {
      const parts = id.split('/');
      collection = parts[0];
      slug = parts[1];
    }
    const entry = globalThis.repoFilesUnpublished[`${collection}/${slug}`];
    if (!entry) {
      return Promise.reject(
        new EditorialWorkflowError('content is not under editorial workflow', true),
      );
    }

    return Promise.resolve(entry);
  }

  async unpublishedEntryDataFile(collection: string, slug: string, path: string) {
    const entry = globalThis.repoFilesUnpublished[`${collection}/${slug}`];
    const file = entry.diffs.find(d => d.path === path);
    return file?.content as string;
  }

  async unpublishedEntryMediaFile(collection: string, slug: string, path: string) {
    const entry = globalThis.repoFilesUnpublished[`${collection}/${slug}`];
    const file = entry.diffs.find(d => d.path === path);
    return this.normalizeAsset(file?.content as AssetProxy);
  }

  deleteUnpublishedEntry(collection: string, slug: string) {
    delete globalThis.repoFilesUnpublished[`${collection}/${slug}`];
    return Promise.resolve();
  }

  async addOrUpdateUnpublishedEntry(
    key: string,
    dataFiles: DataFile[],
    assetProxies: AssetProxy[],
    slug: string,
    collection: string,
    status: string,
  ) {
    const diffs: Diff[] = [];
    for (const dataFile of dataFiles) {
      const { path, newPath, raw } = dataFile;
      const currentDataFile = globalThis.repoFilesUnpublished[key]?.diffs.find(
        d => d.path === path,
      );
      const originalPath = currentDataFile ? currentDataFile.originalPath : path;
      diffs.push({
        originalPath,
        id: newPath || path,
        path: newPath || path,
        newFile: isEmpty(getFile(originalPath as string, globalThis.repoFiles)),
        status: 'added',
        content: raw,
      });
    }
    for (const a of assetProxies) {
      const asset = this.normalizeAsset(a);
      diffs.push({
        id: asset.id,
        path: asset.path,
        newFile: true,
        status: 'added',
        content: asset,
      });
    }
    globalThis.repoFilesUnpublished[key] = {
      slug,
      collection,
      status,
      diffs,
      updatedAt: new Date().toISOString(),
    };
  }

  async persistEntry(entry: Entry, options: PersistOptions) {
    if (options.useWorkflow) {
      const slug = entry.dataFiles[0].slug;
      const key = `${options.collectionName}/${slug}`;
      const currentEntry = globalThis.repoFilesUnpublished[key];
      const status =
        currentEntry?.status || options.status || (this.options.initialWorkflowStatus as string);

      this.addOrUpdateUnpublishedEntry(
        key,
        entry.dataFiles,
        entry.assets,
        slug,
        options.collectionName as string,
        status,
      );
      return;
    }

    for (const dataFile of entry.dataFiles) {
      const { path, raw } = dataFile;
      writeFile(path, raw, globalThis.repoFiles);
    }
    for (const a of entry.assets) {
      writeFile(a.path, a, globalThis.repoFiles);
    }
    return;
  }

  updateUnpublishedEntryStatus(collection: string, slug: string, newStatus: string) {
    globalThis.repoFilesUnpublished[`${collection}/${slug}`].status = newStatus;
    return Promise.resolve();
  }

  publishUnpublishedEntry(collection: string, slug: string) {
    const key = `${collection}/${slug}`;
    const unpubEntry = globalThis.repoFilesUnpublished[key];

    delete globalThis.repoFilesUnpublished[key];

    const tree = globalThis.repoFiles;
    for (const d of unpubEntry.diffs) {
      if (d.originalPath && !d.newFile) {
        const originalPath = d.originalPath;
        const sourceDir = dirname(originalPath);
        const destDir = dirname(d.path);
        const toMove = getFolderFiles(tree, originalPath.split('/')[0], '', 100).filter(f =>
          f.path.startsWith(sourceDir),
        );
        for (const f of toMove) {
          deleteFile(f.path, tree);
          writeFile(f.path.replace(sourceDir, destDir), f.content, tree);
        }
      }
      writeFile(d.path, d.content, tree);
    }

    return Promise.resolve();
  }

  getMedia(mediaFolder = this.mediaFolder) {
    const files = getFolderFiles(globalThis.repoFiles, mediaFolder.split('/')[0], '', 100).filter(
      f => f.path.startsWith(mediaFolder),
    );
    const assets = files.map(f => this.normalizeAsset(f.content as AssetProxy));
    return Promise.resolve(assets);
  }

  async getMediaFile(path: string) {
    const asset = getFile(path, globalThis.repoFiles).content as AssetProxy;

    const url = asset.toString();
    const name = basename(path);
    const blob = await fetch(url).then(res => res.blob());
    const fileObj = new File([blob], name);

    return {
      id: url,
      displayURL: url,
      path,
      name,
      size: fileObj.size,
      file: fileObj,
      url,
    };
  }

  normalizeAsset(assetProxy: AssetProxy) {
    const fileObj = assetProxy.fileObj as File;
    const { name, size } = fileObj;
    const objectUrl = attempt(globalThis.URL.createObjectURL, fileObj);
    const url = isError(objectUrl) ? '' : objectUrl;
    const normalizedAsset = {
      id: uuid(),
      name,
      size,
      path: assetProxy.path,
      url,
      displayURL: url,
      fileObj,
    };

    return normalizedAsset;
  }

  persistMedia(assetProxy: AssetProxy) {
    const normalizedAsset = this.normalizeAsset(assetProxy);

    writeFile(assetProxy.path, assetProxy, globalThis.repoFiles);

    return Promise.resolve(normalizedAsset);
  }

  deleteFiles(paths: string[]) {
    for (const path of paths) {
      deleteFile(path, globalThis.repoFiles);
    }

    return Promise.resolve();
  }

  async getDeployPreview() {
    return null;
  }
}
