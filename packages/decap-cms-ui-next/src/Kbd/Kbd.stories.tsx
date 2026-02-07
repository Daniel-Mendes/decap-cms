import styled from '@emotion/styled';

import { Kbd, KbdGroup } from './Kbd';

export default {
  title: 'Components/Kbd',
  component: Kbd,
};

const StyledWrapper = styled.p`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export function _Kbd() {
  return (
    <StyledWrapper>
      Use <Kbd>Ctrl + K</Kbd> to open the command palette.
    </StyledWrapper>
  );
}

export function _KbdGroup() {
  return (
    <StyledWrapper>
      Press{' '}
      <KbdGroup>
        <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
      </KbdGroup>{' '}
      to open the command palette.
    </StyledWrapper>
  );
}
