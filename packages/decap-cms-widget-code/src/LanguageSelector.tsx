import React from 'react';
import styled from '@emotion/styled';
import {
  Button,
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
} from 'decap-cms-ui-next';

interface LanguageOption {
  value: string;
  label: string;
  alias?: string[];
}

interface LanguageSelectorProps {
  value?: string;
  onChange: (lang: string) => void;
  options: LanguageOption[];
  placeholder?: string;
  width?: number;
}

const LanguageItem = styled(CommandItem)`
  &[data-selected='true'] {
    background-color: ${({ theme }) => theme.color.elevatedSurfaceHighlight};
    color: ${({ theme }) => theme.color.highEmphasis};
  }
`;

export default function LanguageSelector({
  value,
  onChange,
  options,
  placeholder = 'Select language',
}: LanguageSelectorProps) {
  return (
    <Dropdown>
      <DropdownTrigger style={{ display: 'flex', justifyContent: 'end' }}>
        <Button size="sm" variant="soft" type="neutral" transparent>
          {options.find(o => o.value === value)?.label ?? placeholder}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        style={{ padding: 0 }}
      >
        <Command>
          <CommandInput placeholder="Search language…" />

          <CommandList>
            {options.map(option => (
              <LanguageItem
                key={option.value}
                value={option.value}
                option={option}
                keywords={option.alias}
                onSelect={onChange}
                selected={option.value === value}
              >
                {option.label}
              </LanguageItem>
            ))}
          </CommandList>
        </Command>
      </DropdownMenu>
    </Dropdown>
  );
}
