import React, { useCallback } from 'react';
import isEqual from 'lodash/isEqual';
import styled from '@emotion/styled';
import { useArgs } from '@storybook/preview-api';

import ListField from '.';
import TextField from '../TextField';
import BooleanField from '../BooleanField';

const StyledListField = styled(ListField)`
  width: 33vw;
`;

export default {
  title: 'Fields/ListField',
  component: ListField,
  argTypes: {
    items: {
      control: 'object',
    },
  },
  args: {
    label: 'Links',
    labelSingular: 'Link',
    filled: false,
    items: [],
  },
};

export function _ListField(args) {
  const [{ items }, updateArgs] = useArgs();

  function handleChange(updatedItems) {
    updateArgs({ items: updatedItems });
  }

  return (
    <StyledListField
      {...args}
      name="featureLinks"
      onChange={handleChange}
      fields={(setListItemValue, itemIndex) => (
        <>
          <TextField
            name="featureLinkText"
            label="Text"
            value={items[itemIndex] && items[itemIndex].featureLinkText}
            onChange={featureLinkText => setListItemValue({ featureLinkText }, itemIndex)}
          />
          <TextField
            name="featureLinkPath"
            label="Path"
            value={items[itemIndex] && items[itemIndex].featureLinkPath}
            onChange={featureLinkPath => setListItemValue({ featureLinkPath }, itemIndex)}
          />
          <BooleanField
            name="newWindow"
            label="Open In New Window"
            value={items[itemIndex] && items[itemIndex].newWindow}
            onChange={newWindow => setListItemValue({ newWindow }, itemIndex)}
          />
        </>
      )}
    />
  );
}
