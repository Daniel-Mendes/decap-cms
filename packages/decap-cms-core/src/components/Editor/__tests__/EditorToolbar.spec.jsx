import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { fromJS } from 'immutable';

import { EditorToolbar } from '../EditorToolbar';

vi.mock('../../UI', () => ({
  // eslint-disable-next-line react/display-name
  SettingsDropdown: props => <mock-settings-dropdown {...props} />,
}));
vi.mock('react-router-dom', () => {
  return {
    // eslint-disable-next-line react/display-name
    Link: props => <mock-link {...props} />,
  };
});

describe('EditorToolbar', () => {
  const props = {
    isPersisting: false,
    isPublishing: false,
    isUpdatingStatus: false,
    isDeleting: false,
    onPersist: vi.fn(),
    onPersistAndNew: vi.fn(),
    onPersistAndDuplicate: vi.fn(),
    showDelete: true,
    onDelete: vi.fn(),
    onDeleteUnpublishedChanges: vi.fn(),
    onChangeStatus: vi.fn(),
    onPublish: vi.fn(),
    unPublish: vi.fn(),
    onDuplicate: vi.fn(),
    onPublishAndNew: vi.fn(),
    onPublishAndDuplicate: vi.fn(),
    hasChanged: false,
    collection: fromJS({ name: 'posts' }),
    hasWorkflow: false,
    useOpenAuthoring: false,
    hasUnpublishedChanges: false,
    isNewEntry: false,
    isModification: false,
    onLogoutClick: vi.fn(),
    loadDeployPreview: vi.fn(),
    t: vi.fn(key => key),
    editorBackLink: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default props', () => {
    const { asFragment } = render(<EditorToolbar {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  [false, true].forEach(useOpenAuthoring => {
    it(`should render with workflow controls hasUnpublishedChanges=true,isNewEntry=false,isModification=true,useOpenAuthoring=${useOpenAuthoring}`, () => {
      const { asFragment } = render(
        <EditorToolbar
          {...props}
          hasWorkflow={true}
          hasUnpublishedChanges={true}
          isNewEntry={false}
          isModification={true}
          useOpenAuthoring={useOpenAuthoring}
        />,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it(`should render with workflow controls hasUnpublishedChanges=true,isNewEntry=false,isModification=false,useOpenAuthoring=${useOpenAuthoring}`, () => {
      const { asFragment } = render(
        <EditorToolbar
          {...props}
          hasWorkflow={true}
          hasUnpublishedChanges={true}
          isNewEntry={false}
          isModification={false}
          useOpenAuthoring={useOpenAuthoring}
        />,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    it(`should render with workflow controls hasUnpublishedChanges=false,isNewEntry=false,isModification=false,useOpenAuthoring=${useOpenAuthoring}`, () => {
      const { asFragment } = render(
        <EditorToolbar
          {...props}
          hasWorkflow={true}
          hasUnpublishedChanges={false}
          isNewEntry={false}
          isModification={false}
          useOpenAuthoring={useOpenAuthoring}
        />,
      );
      expect(asFragment()).toMatchSnapshot();
    });

    ['draft', 'pending_review', 'pending_publish'].forEach(status => {
      it(`should render with status=${status},useOpenAuthoring=${useOpenAuthoring}`, () => {
        const { asFragment } = render(
          <EditorToolbar
            {...props}
            hasWorkflow={true}
            currentStatus={status}
            useOpenAuthoring={useOpenAuthoring}
          />,
        );
        expect(asFragment()).toMatchSnapshot();
      });
    });

    it(`should render normal save button`, () => {
      const { asFragment } = render(<EditorToolbar {...props} hasChanged={true} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
