import styled from '@emotion/styled';
import React, { useState, useRef, cloneElement, createContext, useContext } from 'react';

import { Menu, MenuItem, MenuSeparator } from '../Menu';

const DropdownContext = createContext({
  triggerRef: null,
  open: false,
  onOpenToggle: () => {},
});

const Trigger = styled.div``;

function DropdownProvider({ children }) {
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);

  function onOpenToggle(e) {
    e.preventDefault();
    e.stopPropagation();

    setOpen(!open);
  }

  return (
    <DropdownContext.Provider value={{ triggerRef, open, onOpenToggle }}>
      {children}
    </DropdownContext.Provider>
  );
}

function useDropdownContext() {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error('useDropdownContext must be used within a DropdownProvider');
  }

  return context;
}

function Dropdown({ children }) {
  return (
    <DropdownProvider>
      {React.Children.map(children, child => {
        if (child.type.name === 'DropdownTrigger' || child.type.name === 'DropdownMenu') {
          return cloneElement(child);
        }

        return null;
      })}
    </DropdownProvider>
  );
}

function DropdownTrigger({ children, ...props }) {
  const { triggerRef, onOpenToggle } = useDropdownContext();

  return (
    <Trigger ref={triggerRef} onClick={onOpenToggle} {...props} data-slot="trigger">
      {children}
    </Trigger>
  );
}

function DropdownMenu({ anchorOrigin, transformOrigin, children, ...props }) {
  const { triggerRef, open, onOpenToggle } = useDropdownContext();

  return (
    <Menu
      anchorEl={triggerRef.current}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      open={open}
      onClose={onOpenToggle}
      {...props}
    >
      {children}
    </Menu>
  );
}

export {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  MenuItem as DropdownMenuItem,
  MenuSeparator as DropdownMenuSeparator,
};
