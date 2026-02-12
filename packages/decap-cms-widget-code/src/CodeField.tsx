import React, { useEffect, useRef, useState } from 'react';
import { Field } from 'decap-cms-ui-next';
import { Map } from 'immutable';
import { basicSetup } from 'codemirror';
import { EditorView, type ViewUpdate } from '@codemirror/view';
import { EditorState, Compartment, type Extension } from '@codemirror/state';
import { languages } from '@codemirror/language-data';

import { useEditorTheme } from './themes/theme';
import LanguageSelector from './LanguageSelector';
import { LanguageDescription } from '@codemirror/language';

interface CodeFieldProps {
  field: Map<string, unknown>;
  value: string | Map<string, unknown>;
  onChange: (newValue: unknown, options?: { selection?: unknown }) => void;
  label?: string;
  inline?: boolean;
  error?: string;
  errors?: string[];
  isEditorComponent: boolean;
  setActiveStyle?: () => void;
  setInactiveStyle?: () => void;
}

export default function CodeField({
  field,
  value,
  onChange,
  label,
  inline,
  error,
  errors,
  isEditorComponent,
  setActiveStyle,
  setInactiveStyle,
  ...props
}: CodeFieldProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);

  const editorTheme = useEditorTheme();

  const keys = getFieldKeys();
  const [lang, setLang] = useState(getDefaultLanguage() || '');
  const langCompartment = useRef(new Compartment()).current;

  const allowLanguageSelection =
    !field.has('allow_language_selection') || field.get('allow_language_selection');

  const languagesOptions = languages
    .map(lang => ({
      value: lang.name.toLowerCase(),
      label: lang.name,
      alias: lang.alias,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  function getDefaultLanguage() {
    const lang = (valueIsMap() && value && value.get(keys.lang)) || field.get('default_language');

    return lang;
  }

  function findLanguage(lang: string): LanguageDescription | null {
    if (!lang) return null;

    return languages.find(l => l.name.toLowerCase() === lang || l.alias?.includes(lang)) ?? null;
  }

  async function loadLanguage(lang: string) {
    if (!viewRef.current) return;

    const languageData = findLanguage(lang);
    if (!languageData) return;

    const languageSupport = await languageData.load();

    // Editor might have unmounted while loading
    if (!viewRef.current) return;

    viewRef.current.dispatch({
      effects: langCompartment.reconfigure(languageSupport),
    });
  }

  function handleChange(update: ViewUpdate) {
    if (update.docChanged) {
      const newCode = update.state.doc.toString();
      const newValue = writeCodeValue(newCode);
      onChange(newValue, {
        selection: update.state.selection.main,
      });
    }
  }

  const updateListener: Extension = EditorView.updateListener.of(update => {
    handleChange(update);
  });

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current) return;

    const doc = extractCodeValue();

    const state = EditorState.create({
      doc,
      extensions: [basicSetup, editorTheme, updateListener, langCompartment.of([])],
    });

    const view = new EditorView({
      parent: editorRef.current,
      state,
    });

    viewRef.current = view;

    if (isEditorComponent) {
      view.focus();
      setActiveStyle?.();
    }

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  // Sync editor content when value changes externally
  useEffect(() => {
    if (!viewRef.current) return;

    const newDoc = extractCodeValue();
    const currentDoc = viewRef.current.state.doc.toString();

    if (newDoc !== currentDoc) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: newDoc,
        },
      });
    }
  }, [value, field, isEditorComponent]);

  useEffect(() => {
    loadLanguage(lang);
  }, [lang]);

  function getFieldKeys() {
    const defaults = { code: 'code', lang: 'lang' };

    if (isEditorComponent) return defaults;

    const keys = field.get('keys', Map()).toJS();
    return { ...defaults, ...keys };
  }

  function valueIsMap() {
    return !field.get('output_code_only') || isEditorComponent;
  }

  function extractCodeValue() {
    const { code } = getFieldKeys();
    if (!valueIsMap()) {
      return value ?? '';
    }
    // value could be Immutable Map or plain object
    return value?.get ? value.get(code) ?? '' : value?.[code] ?? '';
  }

  function writeCodeValue(newCode) {
    if (!valueIsMap()) {
      return newCode;
    }

    const { code } = getFieldKeys();
    if (value?.set) {
      return value.set(code, newCode);
    }
    return { ...(value ?? {}), [code]: newCode };
  }

  function writeLangValue(newLang) {
    if (!valueIsMap()) {
      return value;
    }
    const { lang } = getFieldKeys();
    if (value?.set) {
      return value.set(lang, newLang);
    }
    return { ...(value ?? {}), [lang]: newLang };
  }

  return (
    <Field label={label} inline={inline} error={error} errors={errors}>
      {allowLanguageSelection && (
        <LanguageSelector
          value={lang}
          options={languagesOptions}
          onChange={newLang => {
            setLang(newLang);
            onChange(writeLangValue(newLang));
          }}
        />
      )}

      <div
        ref={editorRef}
        onFocus={() => setActiveStyle?.()}
        onBlur={() => setInactiveStyle?.()}
        {...props}
      />
    </Field>
  );
}
