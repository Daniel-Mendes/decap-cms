import styled from '@emotion/styled';
import { Map } from 'immutable';
import { useArgs } from '@storybook/preview-api';

import CodeField from './CodeField';

const StyledCodeField = styled(CodeField)`
  width: 50vw;
  min-height: 400px;
`;

export default {
  title: 'Fields/CodeField',
  component: CodeField,
  argTypes: {
    value: { control: 'object' },
  },
  args: {
    value: Map({
      code: '',
      lang: '',
    }),
    field: Map({ output_code_only: false }),
    widget: {
      codeMirrorConfig: {},
    },
    classNameWrapper: 'code-control',
    forID: 'code',
  },
};

export function _CodeField(args) {
  const [{ value }, updateArgs] = useArgs();

  function handleChange(newValue) {
    updateArgs({ value: newValue });
  }

  return <StyledCodeField {...args} value={value} onChange={handleChange} />;
}
