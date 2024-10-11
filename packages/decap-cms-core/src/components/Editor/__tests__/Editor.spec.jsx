import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { fromJS } from 'immutable';

import { Editor } from '../Editor';

vi.mock('lodash/debounce', () => {
  const flush = vi.fn();
  return func => {
    func.flush = flush;
    return func;
  };
});
// eslint-disable-next-line react/display-name
vi.mock('../EditorInterface', () => props => <mock-editor-interface {...props} />);
vi.mock('decap-cms-ui-default', () => {
  return {
    // eslint-disable-next-line react/display-name
    Loader: props => <mock-loader {...props} />,
  };
});
vi.mock('../../../routing/history');

describe('Editor', () => {
  const props = {
    boundGetAsset: vi.fn(),
    changeDraftField: vi.fn(),
    changeDraftFieldValidation: vi.fn(),
    collection: fromJS({ name: 'posts' }),
    createDraftDuplicateFromEntry: vi.fn(),
    createEmptyDraft: vi.fn(),
    discardDraft: vi.fn(),
    entry: fromJS({}),
    entryDraft: fromJS({}),
    loadEntry: vi.fn(),
    persistEntry: vi.fn(),
    deleteEntry: vi.fn(),
    showDelete: true,
    fields: fromJS([]),
    slug: 'slug',
    newEntry: true,
    updateUnpublishedEntryStatus: vi.fn(),
    publishUnpublishedEntry: vi.fn(),
    deleteUnpublishedEntry: vi.fn(),
    logoutUser: vi.fn(),
    loadEntries: vi.fn(),
    deployPreview: fromJS({}),
    loadDeployPreview: vi.fn(),
    user: fromJS({}),
    t: vi.fn(key => key),
    localBackup: fromJS({}),
    retrieveLocalBackup: vi.fn(),
    persistLocalBackup: vi.fn(),
    location: { search: '?title=title' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loader when entryDraft is null', () => {
    // suppress prop type error
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { asFragment } = render(<Editor {...props} entryDraft={null} />);
    expect(asFragment()).toMatchSnapshot();
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      'Warning: Failed %s type: %s%s',
      'prop',
      'Required prop `entryDraft` was not specified in `Editor`.',
      expect.anything(),
    );
  });

  it('should render loader when entryDraft entry is undefined', () => {
    const { asFragment } = render(<Editor {...props} entryDraft={fromJS({})} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render loader when entry is fetching', () => {
    const { asFragment } = render(
      <Editor {...props} entryDraft={fromJS({ entry: {} })} entry={fromJS({ isFetching: true })} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render editor interface when entry is not fetching', () => {
    const { asFragment } = render(
      <Editor
        {...props}
        entryDraft={fromJS({ entry: { slug: 'slug' } })}
        entry={fromJS({ isFetching: false })}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should call retrieveLocalBackup on mount', () => {
    render(
      <Editor
        {...props}
        entryDraft={fromJS({ entry: { slug: 'slug' } })}
        entry={fromJS({ isFetching: false })}
      />,
    );

    expect(props.retrieveLocalBackup).toHaveBeenCalledTimes(1);
    expect(props.retrieveLocalBackup).toHaveBeenCalledWith(props.collection, props.slug);
  });

  it('should create new draft on new entry when mounting', () => {
    render(
      <Editor
        {...props}
        entryDraft={fromJS({ entry: { slug: 'slug' } })}
        entry={fromJS({ isFetching: false })}
        newEntry={true}
      />,
    );

    expect(props.createEmptyDraft).toHaveBeenCalledTimes(1);
    expect(props.createEmptyDraft).toHaveBeenCalledWith(props.collection, '?title=title');
    expect(props.loadEntry).toHaveBeenCalledTimes(0);
  });

  it('should load entry on existing entry when mounting', () => {
    render(
      <Editor
        {...props}
        entryDraft={fromJS({ entry: { slug: 'slug' } })}
        entry={fromJS({ isFetching: false })}
        newEntry={false}
      />,
    );

    expect(props.createEmptyDraft).toHaveBeenCalledTimes(0);
    expect(props.loadEntry).toHaveBeenCalledTimes(1);
    expect(props.loadEntry).toHaveBeenCalledWith(props.collection, 'slug');
  });

  it('should load entries when entries are not loaded when mounting', () => {
    render(
      <Editor
        {...props}
        entryDraft={fromJS({ entry: { slug: 'slug' } })}
        entry={fromJS({ isFetching: false })}
        collectionEntriesLoaded={false}
      />,
    );

    expect(props.loadEntries).toHaveBeenCalledTimes(1);
    expect(props.loadEntries).toHaveBeenCalledWith(props.collection);
  });

  it('should not load entries when entries are loaded when mounting', () => {
    render(
      <Editor
        {...props}
        entryDraft={fromJS({ entry: { slug: 'slug' } })}
        entry={fromJS({ isFetching: false })}
        collectionEntriesLoaded={true}
      />,
    );

    expect(props.loadEntries).toHaveBeenCalledTimes(0);
  });

  it('should flush debounce createBackup, discard draft and remove exit blocker on umount', () => {
    window.removeEventListener = vi.fn();
    const debounce = require('lodash/debounce');

    const flush = debounce({}).flush;
    const { unmount } = render(
      <Editor
        {...props}
        entryDraft={fromJS({ entry: { slug: 'slug' }, hasChanged: true })}
        entry={fromJS({ isFetching: false })}
      />,
    );

    vi.clearAllMocks();
    unmount();

    expect(flush).toHaveBeenCalledTimes(1);
    expect(props.discardDraft).toHaveBeenCalledTimes(1);
    expect(window.removeEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));

    const callback = window.removeEventListener.mock.calls.find(
      call => call[0] === 'beforeunload',
    )[1];

    const event = {};
    callback(event);
    expect(event).toEqual({ returnValue: 'editor.editor.onLeavePage' });
  });

  it('should persist backup when changed', () => {
    const { rerender } = render(
      <Editor
        {...props}
        entryDraft={fromJS({ entry: {} })}
        entry={fromJS({ isFetching: false })}
      />,
    );

    vi.clearAllMocks();
    rerender(
      <Editor
        {...props}
        entryDraft={fromJS({ entry: { mediaFiles: [{ id: '1' }] } })}
        entry={fromJS({ isFetching: false, data: {} })}
        hasChanged={true}
      />,
    );

    expect(props.persistLocalBackup).toHaveBeenCalledTimes(1);
    expect(props.persistLocalBackup).toHaveBeenCalledWith(
      fromJS({ mediaFiles: [{ id: '1' }] }),
      props.collection,
    );
  });
});
