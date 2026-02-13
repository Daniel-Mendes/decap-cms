import React, { useEffect } from 'react';
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
  useDropdownContext,
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

const StyledLanguageItem = styled(CommandItem)`
  &[data-selected='true'] {
    background-color: ${({ theme }) => theme.color.elevatedSurfaceHighlight};
    color: ${({ theme }) => theme.color.highEmphasis};
  }
`;

function LanguageItem({ value, onSelect, children, ...props }: any) {
  const { onOpenToggle } = useDropdownContext();

  function handleSelect() {
    onSelect(value);
    onOpenToggle();
  }

  return (
    <StyledLanguageItem onSelect={handleSelect} {...props}>
      {children}
    </StyledLanguageItem>
  );
}

function LanguageInput({ placeholder }: { placeholder?: string }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { open } = useDropdownContext();

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return <CommandInput ref={inputRef} placeholder={placeholder} />;
}

export default function LanguageSelector({ value, onChange, options }: LanguageSelectorProps) {
  const selectedValue = options.find(o => o.value === value);

  return (
    <Dropdown>
      <DropdownTrigger style={{ display: 'flex', justifyContent: 'end' }}>
        <Button size="sm" variant="soft" type="neutral" transparent>
          {selectedValue.label}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        style={{ padding: 0 }}
      >
        <Command>
          <LanguageInput placeholder="Search language…" />

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
