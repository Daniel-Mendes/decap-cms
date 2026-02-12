import React from 'react';
import { useArgs } from '@storybook/preview-api';
import { useDarkMode } from 'storybook-dark-mode';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandLoading,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './Command';
import { Button } from '../Buttons';
import Icon from '../Icon';
import { Kbd } from '../Kbd';

export default {
  title: 'Components/Command',
  component: Command,
  args: {
    open: false,
    search: '',
    loading: false,
  },
};

export function _Command() {
  const isDarkMode = useDarkMode();
  const [{ open, loading }, updateArgs] = useArgs();

  function toggleOpen() {
    updateArgs({ open: !open });
  }

  return (
    <div>
      <p
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        Press <Kbd>Ctrl + K</Kbd> or click the button below
      </p>
      <Button onClick={toggleOpen}>Open Command Menu</Button>

      <CommandDialog open={open} onOpenChange={toggleOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />

          <CommandList>
            {loading ? (
              <CommandLoading>Loading...</CommandLoading>
            ) : (
              <>
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup heading="Quick Actions">
                  <CommandItem>
                    <Icon name="plus" size={16} />
                    <span>Create New Entry</span>
                    <CommandShortcut>⌘N</CommandShortcut>
                  </CommandItem>
                  <CommandItem>
                    <Icon name="upload" size={16} />
                    <span>Upload File</span>
                    <CommandShortcut>⌘U</CommandShortcut>
                  </CommandItem>
                  {isDarkMode ? (
                    <CommandItem>
                      <Icon name="sun" size={16} />
                      <span>Switch to Light Mode</span>
                      <CommandShortcut>⌘T</CommandShortcut>
                    </CommandItem>
                  ) : (
                    <CommandItem>
                      <Icon name="moon" size={16} />
                      <span>Switch to Dark Mode</span>
                      <CommandShortcut>⌘T</CommandShortcut>
                    </CommandItem>
                  )}
                  <CommandItem>
                    <Icon name="log-out" size={16} />
                    <span>Log Out</span>
                    <CommandShortcut>⇧⌘Q</CommandShortcut>
                  </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Editor">
                  <CommandItem>
                    <Icon name="layout" size={16} />
                    <span>Dashboard</span>
                    <CommandShortcut>⌘D</CommandShortcut>
                  </CommandItem>
                  <CommandItem>
                    <Icon name="workflow" size={16} />
                    <span>Workflow</span>
                    <CommandShortcut>⌘W</CommandShortcut>
                  </CommandItem>
                  <CommandItem>
                    <Icon name="image" size={16} />
                    <span>Media</span>
                    <CommandShortcut>⌘M</CommandShortcut>
                  </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Collections">
                  <CommandItem>
                    <Icon name="edit-3" size={16} />
                    <span>Posts</span>
                  </CommandItem>
                  <CommandItem>
                    <Icon name="coffee" size={16} />
                    <span>Restaurants</span>
                  </CommandItem>
                  <CommandItem>
                    <Icon name="help-circle" size={16} />
                    <span>FAQ</span>
                  </CommandItem>
                  <CommandItem>
                    <Icon name="file-text" size={16} />
                    <span>Pages</span>
                  </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Help">
                  <CommandItem>
                    <Icon name="help-circle" size={16} />
                    <span>Support</span>
                  </CommandItem>
                  <CommandItem>
                    <Icon name="book-open-text" size={16} />
                    <span>Documentation</span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
