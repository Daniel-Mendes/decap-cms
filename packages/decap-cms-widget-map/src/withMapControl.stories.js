import React from 'react';
import styled from '@emotion/styled';
import { useArgs } from '@storybook/preview-api';

import withMapControl from './withMapControl';

const MapControl = withMapControl();

const Wrapper = styled.div`
  width: 50vw;
`;

function createMockField(config = {}) {
  return {
    get: (key, defaultValue) => {
      return config[key] !== undefined ? config[key] : defaultValue;
    },
  };
}

export default {
  title: 'Fields/withMapControl',
  component: MapControl,
  argTypes: {},
  args: {
    value: '',
    field: createMockField({ type: 'Point', decimals: 7 }),
  },
};

export function Point(args) {
  const [{ value }, updateArgs] = useArgs();

  function handleChange(newValue) {
    updateArgs({ value: newValue });
  }

  return (
    <Wrapper>
      <MapControl {...args} onChange={handleChange} />
    </Wrapper>
  );
}

export function LineString(args) {
  const [{ value }, updateArgs] = useArgs();
  const field = createMockField({ type: 'LineString', decimals: 5 });

  function handleChange(newValue) {
    updateArgs({ value: newValue });
  }

  return (
    <Wrapper>
      <MapControl {...args} field={field} onChange={handleChange} />
    </Wrapper>
  );
}

export function Polygon(args) {
  const [{ value }, updateArgs] = useArgs();
  const field = createMockField({ type: 'Polygon', decimals: 5 });

  function handleChange(newValue) {
    updateArgs({ value: newValue });
  }

  return (
    <Wrapper>
      <MapControl {...args} field={field} onChange={handleChange} />
    </Wrapper>
  );
}
