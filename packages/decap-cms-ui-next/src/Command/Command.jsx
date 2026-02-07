import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Command as CommandPrimitive } from 'cmdk';

import Dialog from '../Dialog';
import Icon from '../Icon';
import { Loader } from '..';

// Command Root
const StyledCommand = styled(CommandPrimitive)`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.surface};
`;

export const Command = React.forwardRef(({ className, children, ...props }, ref) => (
  <StyledCommand ref={ref} className={className} {...props}>
    {children}
  </StyledCommand>
));

Command.displayName = 'Command';

Command.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

// Command Dialog
const DialogContent = styled.div`
  overflow: hidden;
  padding: 0;
`;

export function CommandDialog({ open, onOpenChange, children, ...props }) {
  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange?.(false)}
      width="640px"
      position={{ x: 'center', y: 'center' }}
      noPadding
      {...props}
    >
      <DialogContent>
        <Command
          style={{
            maxHeight: '500px',
          }}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

CommandDialog.displayName = 'CommandDialog';

CommandDialog.propTypes = {
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  children: PropTypes.node,
};

// Command Input
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.color.neutral[theme.darkMode ? '800' : '300']};
  padding: 0 1rem;

  svg {
    margin-right: 0.5rem;
    height: 1rem;
    width: 1rem;
    flex-shrink: 0;
    opacity: 0.5;
    color: ${({ theme }) => theme.color.mediumEmphasis};
  }
`;

const StyledInput = styled(CommandPrimitive.Input)`
  display: flex;
  height: 3rem;
  width: 100%;
  background-color: transparent;
  padding: 0.75rem 0;
  font-size: 0.875rem;
  font-family: ${({ theme }) => theme.fontFamily};
  color: ${({ theme }) => theme.color.highEmphasis};
  outline: none;
  border: none;
  caret-color: ${({ theme }) => theme.color.primary['900']};

  &::placeholder {
    color: ${({ theme }) => theme.color.disabled};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const CommandInput = React.forwardRef(({ className, ...props }, ref) => (
  <InputWrapper>
    <Icon name="search" size={16} />
    <StyledInput ref={ref} className={className} {...props} />
  </InputWrapper>
));

CommandInput.displayName = 'CommandInput';

CommandInput.propTypes = {
  className: PropTypes.string,
};

// Command List
const StyledCommandList = styled(CommandPrimitive.List)`
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.25rem;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.color.neutral[theme.darkMode ? '700' : '400']};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.color.neutral[theme.darkMode ? '600' : '500']};
  }
`;

export const CommandList = React.forwardRef(({ className, children, ...props }, ref) => (
  <StyledCommandList ref={ref} className={className} {...props}>
    {children}
  </StyledCommandList>
));

CommandList.displayName = 'CommandList';

CommandList.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

// Command Empty
const StyledCommandEmpty = styled(CommandPrimitive.Empty)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.mediumEmphasis};
`;

export const CommandEmpty = React.forwardRef(({ className, children, ...props }, ref) => (
  <StyledCommandEmpty ref={ref} className={className} {...props}>
    <Icon name="circle-slash" size={16} />
    {children}
  </StyledCommandEmpty>
));

CommandEmpty.displayName = 'CommandEmpty';

CommandEmpty.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

// Command Loading
const StyledCommandLoading = styled(CommandPrimitive.Loading)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.mediumEmphasis};
`;

export const CommandLoading = React.forwardRef(({ className, children, ...props }, ref) => (
  <StyledCommandLoading ref={ref} className={className} {...props}>
    <Loader size={16} direction="horizontal">
      {children}
    </Loader>
  </StyledCommandLoading>
));

CommandLoading.displayName = 'CommandLoading';

CommandLoading.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

// Command Group
const StyledCommandGroup = styled(CommandPrimitive.Group)`
  overflow: hidden;
  padding: 0.25rem;
  color: ${({ theme }) => theme.color.highEmphasis};

  &:not(:first-of-type) {
    margin-top: 0.25rem;
    padding-top: 0.5rem;
  }

  [cmdk-group-heading] {
    padding: 0.5rem 0.75rem;
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.color.lowEmphasis};
    line-height: 1rem;
  }
`;

export const CommandGroup = React.forwardRef(({ className, children, heading, ...props }, ref) => (
  <StyledCommandGroup ref={ref} className={className} heading={heading} {...props}>
    {children}
  </StyledCommandGroup>
));

CommandGroup.displayName = 'CommandGroup';

CommandGroup.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  heading: PropTypes.string,
};

// Command Separator
const StyledCommandSeparator = styled(CommandPrimitive.Separator)`
  height: 1px;
  background-color: ${({ theme }) => theme.color.neutral[theme.darkMode ? '800' : '300']};
  margin: 0.25rem 0;
  margin-inline: 0.25rem;
`;

export const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <StyledCommandSeparator ref={ref} className={className} {...props} />
));

CommandSeparator.displayName = 'CommandSeparator';

CommandSeparator.propTypes = {
  className: PropTypes.string,
};

// Command Item
const StyledCommandItem = styled(CommandPrimitive.Item)`
  position: relative;
  display: flex;
  cursor: pointer;
  user-select: none;
  align-items: center;
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.highEmphasis};
  outline: none;
  transition: all 150ms;

  &[aria-selected='true'] {
    background-color: ${({ theme }) =>
      theme.darkMode ? theme.color.neutral['900'] : theme.color.neutral['200']};
  }

  &[aria-disabled='true'] {
    pointer-events: none;
    opacity: 0.5;
  }

  &:hover:not([aria-disabled='true']) {
    background-color: ${({ theme }) =>
      theme.darkMode ? theme.color.neutral['900'] : theme.color.neutral['200']};

    & > [data-slot='command-shortcut'] {
      color: ${({ theme }) => theme.color.highEmphasis};
    }
  }

  svg {
    margin-right: 0.5rem;
    height: 1rem;
    width: 1rem;
    flex-shrink: 0;
  }
`;

export const CommandItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <StyledCommandItem ref={ref} className={className} {...props}>
    {children}
  </StyledCommandItem>
));

CommandItem.displayName = 'CommandItem';

CommandItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  value: PropTypes.string,
  onSelect: PropTypes.func,
  disabled: PropTypes.bool,
};

// Command Shortcut
const StyledCommandShortcut = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.color.disabled};
`;

export function CommandShortcut({ className, children, ...props }) {
  return (
    <StyledCommandShortcut data-slot="command-shortcut" className={className} {...props}>
      {children}
    </StyledCommandShortcut>
  );
}

CommandShortcut.displayName = 'CommandShortcut';

CommandShortcut.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Command;
