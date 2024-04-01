import PropTypes from 'prop-types';
import React, { Component, useState } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styled from '@emotion/styled';
import { OrderedMap } from 'immutable';
import { translate } from 'react-polyglot';
import { connect } from 'react-redux';
import { Loader, components } from 'decap-cms-ui-default';
import { Button, Menu, MenuItem } from 'decap-cms-ui-next';

import { createNewEntry } from '../../actions/collections';
import {
  loadUnpublishedEntries,
  updateUnpublishedEntryStatus,
  publishUnpublishedEntry,
  deleteUnpublishedEntry,
} from '../../actions/editorialWorkflow';
import { selectUnpublishedEntriesByStatus } from '../../reducers';
import { EDITORIAL_WORKFLOW, status } from '../../constants/publishModes';
import WorkflowList from './WorkflowList';

const WorkflowContainer = styled.div`
  padding: 0 2rem;
  height: 100vh;
`;

const WorkflowTop = styled.div`
  display: flex;
  justify-content: space-between;

  margin-bottom: 1rem;
`;

const WorkflowTopHeading = styled.h1`
  ${components.cardTopHeading};
`;

class Workflow extends Component {
  static propTypes = {
    collections: ImmutablePropTypes.map.isRequired,
    isEditorialWorkflow: PropTypes.bool.isRequired,
    isOpenAuthoring: PropTypes.bool,
    isFetching: PropTypes.bool,
    unpublishedEntries: ImmutablePropTypes.map,
    loadUnpublishedEntries: PropTypes.func.isRequired,
    updateUnpublishedEntryStatus: PropTypes.func.isRequired,
    publishUnpublishedEntry: PropTypes.func.isRequired,
    deleteUnpublishedEntry: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      newPostMenuAnchorEl: null,
    };
  }

  componentDidMount() {
    const { loadUnpublishedEntries, isEditorialWorkflow, collections } = this.props;
    if (isEditorialWorkflow) {
      loadUnpublishedEntries(collections);
    }
  }

  render() {
    const {
      isEditorialWorkflow,
      isOpenAuthoring,
      isFetching,
      unpublishedEntries,
      updateUnpublishedEntryStatus,
      publishUnpublishedEntry,
      deleteUnpublishedEntry,
      collections,
      t,
    } = this.props;

    if (!isEditorialWorkflow) return null;
    if (isFetching) return <Loader active>{t('workflow.workflow.loading')}</Loader>;
    const reviewCount = unpublishedEntries.get('pending_review').size;
    const readyCount = unpublishedEntries.get('pending_publish').size;

    return (
      <WorkflowContainer>
        <WorkflowTop>
          <WorkflowTopHeading>{t('workflow.workflow.workflowHeading')}</WorkflowTopHeading>

          <Button
            onClick={event =>
              this.setState({ newPostMenuAnchorEl: event ? event.currentTarget : null })
            }
            icon={'plus'}
            hasMenu
          >
            {t('workflow.workflow.newPost')}
          </Button>

          <Menu
            anchorEl={this.state.newPostMenuAnchorEl}
            open={!!this.state.newPostMenuAnchorEl}
            onClose={() => this.setState({ newPostMenuAnchorEl: null })}
          >
            {collections
              .filter(collection => collection.get('create'))
              .toList()
              .map(collection => (
                <MenuItem
                  key={collection.get('name')}
                  onClick={() => createNewEntry(collection.get('name'))}
                >
                  {collection.get('label_singular') || collection.get('label')}
                </MenuItem>
              ))}
          </Menu>
        </WorkflowTop>

        <WorkflowList
          entries={unpublishedEntries}
          handleChangeStatus={updateUnpublishedEntryStatus}
          handlePublish={publishUnpublishedEntry}
          handleDelete={deleteUnpublishedEntry}
          isOpenAuthoring={isOpenAuthoring}
          collections={collections}
        />
      </WorkflowContainer>
    );
  }
}

function mapStateToProps(state) {
  const { collections, config, globalUI } = state;
  const isEditorialWorkflow = config.publish_mode === EDITORIAL_WORKFLOW;
  const isOpenAuthoring = globalUI.useOpenAuthoring;
  const returnObj = { collections, isEditorialWorkflow, isOpenAuthoring };

  if (isEditorialWorkflow) {
    returnObj.isFetching = state.editorialWorkflow.getIn(['pages', 'isFetching'], false);

    /*
     * Generates an ordered Map of the available status as keys.
     * Each key containing a Sequence of available unpubhlished entries
     * Eg.: OrderedMap{'draft':Seq(), 'pending_review':Seq(), 'pending_publish':Seq()}
     */
    returnObj.unpublishedEntries = status.reduce((acc, currStatus) => {
      const entries = selectUnpublishedEntriesByStatus(state, currStatus);
      return acc.set(currStatus, entries);
    }, OrderedMap());
  }
  return returnObj;
}

export default connect(mapStateToProps, {
  loadUnpublishedEntries,
  updateUnpublishedEntryStatus,
  publishUnpublishedEntry,
  deleteUnpublishedEntry,
})(translate()(Workflow));
