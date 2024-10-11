import { Base64 } from 'js-base64';
import { vi } from 'vitest';

import API from '../API';

global.fetch = vi.fn().mockRejectedValue(new Error('should not call fetch inside tests'));

describe('github API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  function mockAPI(api, responses) {
    api.request = vi.fn().mockImplementation((path, options = {}) => {
      const normalizedPath = path.indexOf('?') !== -1 ? path.slice(0, path.indexOf('?')) : path;
      const response = responses[normalizedPath];
      return typeof response === 'function'
        ? Promise.resolve(response(options))
        : Promise.reject(new Error(`No response for path '${normalizedPath}'`));
    });
  }

  describe('editorialWorkflowGit', () => {
    it('should create PR with correct base branch name when publishing with editorial workflow', () => {
      let prBaseBranch = null;
      let labels = null;
      const api = new API({
        branch: 'gh-pages',
        repo: 'owner/my-repo',
        initialWorkflowStatus: 'draft',
      });
      const responses = {
        '/repos/owner/my-repo/branches/gh-pages': () => ({ commit: { sha: 'def' } }),
        '/repos/owner/my-repo/git/trees/def': () => ({ tree: [] }),
        '/repos/owner/my-repo/git/trees': () => ({}),
        '/repos/owner/my-repo/git/commits': () => ({}),
        '/repos/owner/my-repo/git/refs': () => ({}),
        '/repos/owner/my-repo/pulls': req => {
          prBaseBranch = JSON.parse(req.body).base;
          return { head: { sha: 'cbd' }, labels: [], number: 1 };
        },
        '/repos/owner/my-repo/issues/1/labels': req => {
          labels = JSON.parse(req.body).labels;
          return {};
        },
      };
      mockAPI(api, responses);

      return expect(
        api.editorialWorkflowGit([], { slug: 'entry', sha: 'abc' }, null, {}).then(() => ({
          prBaseBranch,
          labels,
        })),
      ).resolves.toEqual({ prBaseBranch: 'gh-pages', labels: ['decap-cms/draft'] });
    });

    it('should create PR with correct base branch name with custom prefix when publishing with editorial workflow', () => {
      let prBaseBranch = null;
      let labels = null;
      const api = new API({
        branch: 'gh-pages',
        repo: 'owner/my-repo',
        initialWorkflowStatus: 'draft',
        cmsLabelPrefix: 'other/',
      });
      const responses = {
        '/repos/owner/my-repo/branches/gh-pages': () => ({ commit: { sha: 'def' } }),
        '/repos/owner/my-repo/git/trees/def': () => ({ tree: [] }),
        '/repos/owner/my-repo/git/trees': () => ({}),
        '/repos/owner/my-repo/git/commits': () => ({}),
        '/repos/owner/my-repo/git/refs': () => ({}),
        '/repos/owner/my-repo/pulls': req => {
          prBaseBranch = JSON.parse(req.body).base;
          return { head: { sha: 'cbd' }, labels: [], number: 1 };
        },
        '/repos/owner/my-repo/issues/1/labels': req => {
          labels = JSON.parse(req.body).labels;
          return {};
        },
      };
      mockAPI(api, responses);

      return expect(
        api.editorialWorkflowGit([], { slug: 'entry', sha: 'abc' }, null, {}).then(() => ({
          prBaseBranch,
          labels,
        })),
      ).resolves.toEqual({ prBaseBranch: 'gh-pages', labels: ['other/draft'] });
    });
  });

  describe('updateTree', () => {
    it('should create tree with nested paths', async () => {
      const api = new API({ branch: 'master', repo: 'owner/repo' });

      api.createTree = vi.fn().mockImplementation(() => Promise.resolve({ sha: 'newTreeSha' }));

      const files = [
        { path: '/static/media/new-image.jpeg', sha: null },
        { path: 'content/posts/new-post.md', sha: 'new-post.md' },
      ];

      const baseTreeSha = 'baseTreeSha';

      await expect(api.updateTree(baseTreeSha, files)).resolves.toEqual({
        sha: 'newTreeSha',
        parentSha: baseTreeSha,
      });

      expect(api.createTree).toHaveBeenCalledTimes(1);
      expect(api.createTree).toHaveBeenCalledWith(baseTreeSha, [
        {
          path: 'static/media/new-image.jpeg',
          mode: '100644',
          type: 'blob',
          sha: null,
        },
        {
          path: 'content/posts/new-post.md',
          mode: '100644',
          type: 'blob',
          sha: 'new-post.md',
        },
      ]);
    });
  });

  describe('request', () => {
    beforeEach(() => {
      const fetch = vi.fn();
      global.fetch = fetch;
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    it('should fetch url with authorization header', async () => {
      const api = new API({ branch: 'gh-pages', repo: 'my-repo', token: 'token' });

      fetch.mockResolvedValue({
        text: vi.fn().mockResolvedValue('some response'),
        ok: true,
        status: 200,
        headers: { get: () => '' },
      });
      const result = await api.request('/some-path');
      expect(result).toEqual('some response');
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://api.github.com/some-path', {
        cache: 'no-cache',
        headers: {
          Authorization: 'token token',
          'Content-Type': 'application/json; charset=utf-8',
        },
        signal: expect.any(AbortSignal),
      });
    });

    it('should throw error on not ok response', async () => {
      const api = new API({ branch: 'gh-pages', repo: 'my-repo', token: 'token' });

      fetch.mockResolvedValue({
        text: vi.fn().mockResolvedValue({ message: 'some error' }),
        ok: false,
        status: 404,
        headers: { get: () => '' },
      });

      await expect(api.request('some-path')).rejects.toThrow(
        expect.objectContaining({
          message: 'some error',
          name: 'API_ERROR',
          status: 404,
          api: 'GitHub',
        }),
      );
    });

    it('should allow overriding requestHeaders to return a promise ', async () => {
      const api = new API({ branch: 'gh-pages', repo: 'my-repo', token: 'token' });

      api.requestHeaders = vi.fn().mockResolvedValue({
        Authorization: 'promise-token',
        'Content-Type': 'application/json; charset=utf-8',
      });

      fetch.mockResolvedValue({
        text: vi.fn().mockResolvedValue('some response'),
        ok: true,
        status: 200,
        headers: { get: () => '' },
      });
      const result = await api.request('/some-path');
      expect(result).toEqual('some response');
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('https://api.github.com/some-path', {
        cache: 'no-cache',
        headers: {
          Authorization: 'promise-token',
          'Content-Type': 'application/json; charset=utf-8',
        },
        signal: expect.any(AbortSignal),
      });
    });
  });

  describe('persistFiles', () => {
    it('should update tree, commit and patch branch when useWorkflow is false', async () => {
      const api = new API({ branch: 'master', repo: 'owner/repo' });

      const responses = {
        // upload the file
        '/repos/owner/repo/git/blobs': () => ({ sha: 'new-file-sha' }),

        // get the branch
        '/repos/owner/repo/branches/master': () => ({ commit: { sha: 'root' } }),

        // create new tree
        '/repos/owner/repo/git/trees': options => {
          const data = JSON.parse(options.body);
          return { sha: data.base_tree };
        },

        // update the commit with the tree
        '/repos/owner/repo/git/commits': () => ({ sha: 'commit-sha' }),

        // patch the branch
        '/repos/owner/repo/git/refs/heads/master': () => ({}),
      };
      mockAPI(api, responses);

      const entry = {
        dataFiles: [
          {
            slug: 'entry',
            sha: 'abc',
            path: 'content/posts/new-post.md',
            raw: 'content',
          },
        ],
        assets: [],
      };
      await api.persistFiles(entry.dataFiles, entry.assets, { commitMessage: 'commitMessage' });

      expect(api.request).toHaveBeenCalledTimes(5);

      expect(api.request.mock.calls[0]).toEqual([
        '/repos/owner/repo/git/blobs',
        {
          method: 'POST',
          body: JSON.stringify({
            content: Base64.encode(entry.dataFiles[0].raw),
            encoding: 'base64',
          }),
        },
      ]);

      expect(api.request.mock.calls[1]).toEqual(['/repos/owner/repo/branches/master']);

      expect(api.request.mock.calls[2]).toEqual([
        '/repos/owner/repo/git/trees',
        {
          body: JSON.stringify({
            base_tree: 'root',
            tree: [
              {
                path: 'content/posts/new-post.md',
                mode: '100644',
                type: 'blob',
                sha: 'new-file-sha',
              },
            ],
          }),
          method: 'POST',
        },
      ]);

      expect(api.request.mock.calls[3]).toEqual([
        '/repos/owner/repo/git/commits',
        {
          body: JSON.stringify({
            message: 'commitMessage',
            tree: 'root',
            parents: ['root'],
          }),
          method: 'POST',
        },
      ]);

      expect(api.request.mock.calls[4]).toEqual([
        '/repos/owner/repo/git/refs/heads/master',
        {
          body: JSON.stringify({
            sha: 'commit-sha',
            force: false,
          }),
          method: 'PATCH',
        },
      ]);
    });

    it('should call editorialWorkflowGit when useWorkflow is true', async () => {
      const api = new API({ branch: 'master', repo: 'owner/repo' });

      api.uploadBlob = vi.fn();
      api.editorialWorkflowGit = vi.fn();

      const entry = {
        dataFiles: [
          {
            slug: 'entry',
            sha: 'abc',
            path: 'content/posts/new-post.md',
            raw: 'content',
          },
        ],
        assets: [
          {
            path: '/static/media/image-1.png',
            sha: 'image-1.png',
          },
          {
            path: '/static/media/image-2.png',
            sha: 'image-2.png',
          },
        ],
      };

      await api.persistFiles(entry.dataFiles, entry.assets, { useWorkflow: true });

      expect(api.uploadBlob).toHaveBeenCalledTimes(3);
      expect(api.uploadBlob).toHaveBeenCalledWith(entry.dataFiles[0]);
      expect(api.uploadBlob).toHaveBeenCalledWith(entry.assets[0]);
      expect(api.uploadBlob).toHaveBeenCalledWith(entry.assets[1]);

      expect(api.editorialWorkflowGit).toHaveBeenCalledTimes(1);

      expect(api.editorialWorkflowGit).toHaveBeenCalledWith(
        entry.assets.concat(entry.dataFiles),
        entry.dataFiles[0].slug,
        [
          { path: 'static/media/image-1.png', sha: 'image-1.png' },
          { path: 'static/media/image-2.png', sha: 'image-2.png' },
        ],
        { useWorkflow: true },
      );
    });
  });

  describe('migratePullRequest', () => {
    it('should migrate to pull request labels when no version', async () => {
      const api = new API({ branch: 'master', repo: 'owner/repo' });

      const pr = {
        head: { ref: 'cms/2019-11-11-post-title' },
        title: 'pr title',
        number: 1,
        labels: [],
      };
      const metadata = { type: 'PR' };
      api.retrieveMetadataOld = vi.fn().mockResolvedValue(metadata);
      const newBranch = 'cms/posts/2019-11-11-post-title';
      const migrateToVersion1Result = {
        metadata: { ...metadata, branch: newBranch, version: '1' },
        pullRequest: { ...pr, number: 2 },
      };
      api.migrateToVersion1 = vi.fn().mockResolvedValue(migrateToVersion1Result);
      api.migrateToPullRequestLabels = vi.fn();

      await api.migratePullRequest(pr);

      expect(api.migrateToVersion1).toHaveBeenCalledTimes(1);
      expect(api.migrateToVersion1).toHaveBeenCalledWith(pr, metadata);

      expect(api.migrateToPullRequestLabels).toHaveBeenCalledTimes(1);
      expect(api.migrateToPullRequestLabels).toHaveBeenCalledWith(
        migrateToVersion1Result.pullRequest,
        migrateToVersion1Result.metadata,
      );

      expect(api.retrieveMetadataOld).toHaveBeenCalledTimes(1);
      expect(api.retrieveMetadataOld).toHaveBeenCalledWith('2019-11-11-post-title');
    });

    it('should migrate to pull request labels when version is 1', async () => {
      const api = new API({ branch: 'master', repo: 'owner/repo' });

      api.migrateToVersion1 = vi.fn();
      const pr = {
        head: { ref: 'cms/posts/2019-11-11-post-title' },
        title: 'pr title',
        number: 1,
        labels: [],
      };
      const metadata = { type: 'PR', version: '1' };
      api.retrieveMetadataOld = vi.fn().mockResolvedValue(metadata);
      api.migrateToPullRequestLabels = vi.fn().mockResolvedValue(pr, metadata);

      await api.migratePullRequest(pr);

      expect(api.migrateToVersion1).toHaveBeenCalledTimes(0);

      expect(api.migrateToPullRequestLabels).toHaveBeenCalledTimes(1);
      expect(api.migrateToPullRequestLabels).toHaveBeenCalledWith(pr, metadata);

      expect(api.retrieveMetadataOld).toHaveBeenCalledTimes(1);
      expect(api.retrieveMetadataOld).toHaveBeenCalledWith('posts/2019-11-11-post-title');
    });
  });

  describe('migrateToVersion1', () => {
    it('should migrate to version 1', async () => {
      const api = new API({ branch: 'master', repo: 'owner/repo' });

      const pr = {
        head: { ref: 'cms/2019-11-11-post-title', sha: 'pr_head' },
        title: 'pr title',
        number: 1,
        labels: [],
      };

      const newBranch = { ref: 'refs/heads/cms/posts/2019-11-11-post-title' };
      api.createBranch = vi.fn().mockResolvedValue(newBranch);
      api.getBranch = vi.fn().mockRejectedValue(new Error('Branch not found'));

      const newPr = { ...pr, number: 2 };
      api.createPR = vi.fn().mockResolvedValue(newPr);
      api.getPullRequests = vi.fn().mockResolvedValue([]);

      api.storeMetadata = vi.fn();
      api.closePR = vi.fn();
      api.deleteBranch = vi.fn();
      api.deleteMetadata = vi.fn();

      const branch = 'cms/2019-11-11-post-title';
      const metadata = {
        branch,
        type: 'PR',
        pr: { head: pr.head.sha },
        commitMessage: 'commitMessage',
        collection: 'posts',
      };

      const expectedMetadata = {
        type: 'PR',
        pr: { head: newPr.head.sha, number: 2 },
        commitMessage: 'commitMessage',
        collection: 'posts',
        branch: 'cms/posts/2019-11-11-post-title',
        version: '1',
      };
      await expect(api.migrateToVersion1(pr, metadata)).resolves.toEqual({
        metadata: expectedMetadata,
        pullRequest: newPr,
      });

      expect(api.getBranch).toHaveBeenCalledTimes(1);
      expect(api.getBranch).toHaveBeenCalledWith('cms/posts/2019-11-11-post-title');
      expect(api.createBranch).toHaveBeenCalledTimes(1);
      expect(api.createBranch).toHaveBeenCalledWith('cms/posts/2019-11-11-post-title', 'pr_head');

      expect(api.getPullRequests).toHaveBeenCalledTimes(1);
      expect(api.getPullRequests).toHaveBeenCalledWith(
        'cms/posts/2019-11-11-post-title',
        'all',
        expect.any(Function),
      );
      expect(api.createPR).toHaveBeenCalledTimes(1);
      expect(api.createPR).toHaveBeenCalledWith('pr title', 'cms/posts/2019-11-11-post-title');

      expect(api.storeMetadata).toHaveBeenCalledTimes(1);
      expect(api.storeMetadata).toHaveBeenCalledWith(
        'posts/2019-11-11-post-title',
        expectedMetadata,
      );

      expect(api.closePR).toHaveBeenCalledTimes(1);
      expect(api.closePR).toHaveBeenCalledWith(pr.number);

      expect(api.deleteBranch).toHaveBeenCalledTimes(1);
      expect(api.deleteBranch).toHaveBeenCalledWith('cms/2019-11-11-post-title');

      expect(api.deleteMetadata).toHaveBeenCalledTimes(1);
      expect(api.deleteMetadata).toHaveBeenCalledWith('2019-11-11-post-title');
    });

    it('should not create new branch if exists', async () => {
      const api = new API({ branch: 'master', repo: 'owner/repo' });

      const pr = {
        head: { ref: 'cms/2019-11-11-post-title', sha: 'pr_head' },
        title: 'pr title',
        number: 1,
        labels: [],
      };

      const newBranch = { ref: 'refs/heads/cms/posts/2019-11-11-post-title' };
      api.createBranch = vi.fn();
      api.getBranch = vi.fn().mockResolvedValue(newBranch);

      const newPr = { ...pr, number: 2 };
      api.createPR = vi.fn().mockResolvedValue(newPr);
      api.getPullRequests = vi.fn().mockResolvedValue([]);

      api.storeMetadata = vi.fn();
      api.closePR = vi.fn();
      api.deleteBranch = vi.fn();
      api.deleteMetadata = vi.fn();

      const branch = 'cms/2019-11-11-post-title';
      const metadata = {
        branch,
        type: 'PR',
        pr: { head: pr.head.sha },
        commitMessage: 'commitMessage',
        collection: 'posts',
      };

      const expectedMetadata = {
        type: 'PR',
        pr: { head: newPr.head.sha, number: 2 },
        commitMessage: 'commitMessage',
        collection: 'posts',
        branch: 'cms/posts/2019-11-11-post-title',
        version: '1',
      };
      await expect(api.migrateToVersion1(pr, metadata)).resolves.toEqual({
        metadata: expectedMetadata,
        pullRequest: newPr,
      });

      expect(api.getBranch).toHaveBeenCalledTimes(1);
      expect(api.getBranch).toHaveBeenCalledWith('cms/posts/2019-11-11-post-title');
      expect(api.createBranch).toHaveBeenCalledTimes(0);

      expect(api.getPullRequests).toHaveBeenCalledTimes(1);
      expect(api.getPullRequests).toHaveBeenCalledWith(
        'cms/posts/2019-11-11-post-title',
        'all',
        expect.any(Function),
      );
      expect(api.createPR).toHaveBeenCalledTimes(1);
      expect(api.createPR).toHaveBeenCalledWith('pr title', 'cms/posts/2019-11-11-post-title');

      expect(api.storeMetadata).toHaveBeenCalledTimes(1);
      expect(api.storeMetadata).toHaveBeenCalledWith(
        'posts/2019-11-11-post-title',
        expectedMetadata,
      );

      expect(api.closePR).toHaveBeenCalledTimes(1);
      expect(api.closePR).toHaveBeenCalledWith(pr.number);

      expect(api.deleteBranch).toHaveBeenCalledTimes(1);
      expect(api.deleteBranch).toHaveBeenCalledWith('cms/2019-11-11-post-title');

      expect(api.deleteMetadata).toHaveBeenCalledTimes(1);
      expect(api.deleteMetadata).toHaveBeenCalledWith('2019-11-11-post-title');
    });

    it('should not create new pr if exists', async () => {
      const api = new API({ branch: 'master', repo: 'owner/repo' });

      const pr = {
        head: { ref: 'cms/2019-11-11-post-title', sha: 'pr_head' },
        title: 'pr title',
        number: 1,
        labels: [],
      };

      const newBranch = { ref: 'refs/heads/cms/posts/2019-11-11-post-title' };
      api.createBranch = vi.fn();
      api.getBranch = vi.fn().mockResolvedValue(newBranch);

      const newPr = { ...pr, number: 2 };
      api.createPR = vi.fn();
      api.getPullRequests = vi.fn().mockResolvedValue([newPr]);

      api.storeMetadata = vi.fn();
      api.closePR = vi.fn();
      api.deleteBranch = vi.fn();
      api.deleteMetadata = vi.fn();

      const branch = 'cms/2019-11-11-post-title';
      const metadata = {
        branch,
        type: 'PR',
        pr: { head: pr.head.sha },
        commitMessage: 'commitMessage',
        collection: 'posts',
      };

      const expectedMetadata = {
        type: 'PR',
        pr: { head: newPr.head.sha, number: 2 },
        commitMessage: 'commitMessage',
        collection: 'posts',
        branch: 'cms/posts/2019-11-11-post-title',
        version: '1',
      };
      await expect(api.migrateToVersion1(pr, metadata)).resolves.toEqual({
        metadata: expectedMetadata,
        pullRequest: newPr,
      });

      expect(api.getBranch).toHaveBeenCalledTimes(1);
      expect(api.getBranch).toHaveBeenCalledWith('cms/posts/2019-11-11-post-title');
      expect(api.createBranch).toHaveBeenCalledTimes(0);

      expect(api.getPullRequests).toHaveBeenCalledTimes(1);
      expect(api.getPullRequests).toHaveBeenCalledWith(
        'cms/posts/2019-11-11-post-title',
        'all',
        expect.any(Function),
      );
      expect(api.createPR).toHaveBeenCalledTimes(0);

      expect(api.storeMetadata).toHaveBeenCalledTimes(1);
      expect(api.storeMetadata).toHaveBeenCalledWith(
        'posts/2019-11-11-post-title',
        expectedMetadata,
      );

      expect(api.closePR).toHaveBeenCalledTimes(1);
      expect(api.closePR).toHaveBeenCalledWith(pr.number);

      expect(api.deleteBranch).toHaveBeenCalledTimes(1);
      expect(api.deleteBranch).toHaveBeenCalledWith('cms/2019-11-11-post-title');

      expect(api.deleteMetadata).toHaveBeenCalledTimes(1);
      expect(api.deleteMetadata).toHaveBeenCalledWith('2019-11-11-post-title');
    });
  });

  describe('migrateToPullRequestLabels', () => {
    it('should migrate to pull request labels', async () => {
      const api = new API({ branch: 'master', repo: 'owner/repo' });

      const pr = {
        head: { ref: 'cms/posts/2019-11-11-post-title', sha: 'pr_head' },
        title: 'pr title',
        number: 1,
        labels: [],
      };

      api.setPullRequestStatus = vi.fn();
      api.deleteMetadata = vi.fn();

      const metadata = {
        branch: pr.head.ref,
        type: 'PR',
        pr: { head: pr.head.sha },
        commitMessage: 'commitMessage',
        collection: 'posts',
        status: 'pending_review',
      };

      await api.migrateToPullRequestLabels(pr, metadata);

      expect(api.setPullRequestStatus).toHaveBeenCalledTimes(1);
      expect(api.setPullRequestStatus).toHaveBeenCalledWith(pr, 'pending_review');

      expect(api.deleteMetadata).toHaveBeenCalledTimes(1);
      expect(api.deleteMetadata).toHaveBeenCalledWith('posts/2019-11-11-post-title');
    });
  });

  describe('rebaseSingleCommit', () => {
    it('should create updated tree and commit', async () => {
      const api = new API({ branch: 'master', repo: 'owner/repo' });

      api.getDifferences = vi.fn().mockResolvedValueOnce({
        files: [
          { filename: 'removed.md', status: 'removed', sha: 'removed_sha' },
          {
            filename: 'renamed.md',
            status: 'renamed',
            previous_filename: 'previous_filename.md',
            sha: 'renamed_sha',
          },
          { filename: 'added.md', status: 'added', sha: 'added_sha' },
        ],
      });

      const newTree = { sha: 'new_tree_sha' };
      api.updateTree = vi.fn().mockResolvedValueOnce(newTree);

      const newCommit = { sha: 'newCommit' };
      api.createCommit = vi.fn().mockResolvedValueOnce(newCommit);

      const baseCommit = { sha: 'base_commit_sha' };
      const commit = {
        sha: 'sha',
        parents: [{ sha: 'parent_sha' }],
        commit: {
          message: 'message',
          author: { name: 'author' },
          committer: { name: 'committer' },
        },
      };

      await expect(api.rebaseSingleCommit(baseCommit, commit)).resolves.toBe(newCommit);

      expect(api.getDifferences).toHaveBeenCalledTimes(1);
      expect(api.getDifferences).toHaveBeenCalledWith('parent_sha', 'sha');

      expect(api.updateTree).toHaveBeenCalledTimes(1);
      expect(api.updateTree).toHaveBeenCalledWith('base_commit_sha', [
        { path: 'removed.md', sha: null },
        { path: 'previous_filename.md', sha: null },
        { path: 'renamed.md', sha: 'renamed_sha' },
        { path: 'added.md', sha: 'added_sha' },
      ]);

      expect(api.createCommit).toHaveBeenCalledTimes(1);
      expect(api.createCommit).toHaveBeenCalledWith(
        'message',
        newTree.sha,
        [baseCommit.sha],
        { name: 'author' },
        { name: 'committer' },
      );
    });
  });

  describe('listFiles', () => {
    it('should get files by depth', async () => {
      const api = new API({ branch: 'master', repo: 'owner/repo' });

      const tree = [
        {
          path: 'post.md',
          type: 'blob',
        },
        {
          path: 'dir1',
          type: 'tree',
        },
        {
          path: 'dir1/nested-post.md',
          type: 'blob',
        },
        {
          path: 'dir1/dir2',
          type: 'tree',
        },
        {
          path: 'dir1/dir2/nested-post.md',
          type: 'blob',
        },
      ];
      api.request = vi.fn().mockResolvedValue({ tree });

      await expect(api.listFiles('posts', { depth: 1 })).resolves.toEqual([
        {
          path: 'posts/post.md',
          type: 'blob',
          name: 'post.md',
        },
      ]);
      expect(api.request).toHaveBeenCalledTimes(1);
      expect(api.request).toHaveBeenCalledWith('/repos/owner/repo/git/trees/master:posts', {
        params: {},
      });

      vi.clearAllMocks();
      await expect(api.listFiles('posts', { depth: 2 })).resolves.toEqual([
        {
          path: 'posts/post.md',
          type: 'blob',
          name: 'post.md',
        },
        {
          path: 'posts/dir1/nested-post.md',
          type: 'blob',
          name: 'nested-post.md',
        },
      ]);
      expect(api.request).toHaveBeenCalledTimes(1);
      expect(api.request).toHaveBeenCalledWith('/repos/owner/repo/git/trees/master:posts', {
        params: { recursive: 1 },
      });

      vi.clearAllMocks();
      await expect(api.listFiles('posts', { depth: 3 })).resolves.toEqual([
        {
          path: 'posts/post.md',
          type: 'blob',
          name: 'post.md',
        },
        {
          path: 'posts/dir1/nested-post.md',
          type: 'blob',
          name: 'nested-post.md',
        },
        {
          path: 'posts/dir1/dir2/nested-post.md',
          type: 'blob',
          name: 'nested-post.md',
        },
      ]);
      expect(api.request).toHaveBeenCalledTimes(1);
      expect(api.request).toHaveBeenCalledWith('/repos/owner/repo/git/trees/master:posts', {
        params: { recursive: 1 },
      });
    });
  });

  test('should get preview statuses', async () => {
    const api = new API({ repo: 'repo' });

    const statuses = [
      { context: 'deploy', state: 'success', target_url: 'deploy-url' },
      { context: 'build', state: 'error' },
    ];

    api.request = vi.fn(() => Promise.resolve({ statuses }));
    const sha = 'sha';
    api.getBranchPullRequest = vi.fn(() => Promise.resolve({ head: { sha } }));

    const collection = 'collection';
    const slug = 'slug';
    await expect(api.getStatuses(collection, slug)).resolves.toEqual([
      { context: 'deploy', state: 'success', target_url: 'deploy-url' },
      { context: 'build', state: 'other' },
    ]);

    expect(api.getBranchPullRequest).toHaveBeenCalledTimes(1);
    expect(api.getBranchPullRequest).toHaveBeenCalledWith('cms/collection/slug');
    expect(api.request).toHaveBeenCalledTimes(1);
    expect(api.request).toHaveBeenCalledWith(`/repos/repo/commits/${sha}/status`);
  });
});
