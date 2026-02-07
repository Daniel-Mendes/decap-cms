import styled from '@emotion/styled';

const StyledKbd = styled.kbd`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  pointer-events: none;
  padding: 0.25rem 0.5rem;
  background: ${({ theme }) => theme.color.surface};
  border-radius: 4px;
  font-size: 10px;
  color: ${({ theme }) => theme.color.highEmphasis};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const StyledKbdGroup = styled.kbd`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;

function Kbd({ children, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <StyledKbd data-slot="kbd" {...props}>
      {children}
    </StyledKbd>
  );
}

function KbdGroup({ children, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <StyledKbdGroup data-slot="kbd-group" {...props}>
      {children}
    </StyledKbdGroup>
  );
}

export { Kbd, KbdGroup };
