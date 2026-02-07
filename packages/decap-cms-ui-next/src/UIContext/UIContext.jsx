import React, { createContext, useState, useEffect } from 'react';

import { useLocalStorageState } from '../hooks';

export const UIContext = createContext({
  appBarStart: () => null,
  renderAppBarStart: () => {},
  appBarEnd: () => null,
  renderAppBarEnd: () => {},
  darkMode: false,
  setDarkMode: () => {},
  navCollapsed: false,
  setNavCollapsed: () => {},
  pageTitle: '',
  setPageTitle: () => {},
  breadcrumbs: [],
  setBreadcrumbs: () => {},
});

export function UIProvider({ children, value: overrideValue }) {
  const [darkMode, setDarkMode] = useLocalStorageState(
    'darkMode',
    window && window.matchMedia('(prefers-color-scheme: dark)').matches,
  );
  const [navCollapsed, setNavCollapsed] = useLocalStorageState('navCollapsed', false);
  const [pageTitle, setPageTitle] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [appBarStart, setAppBarStart] = useState(() => () => null);
  const [appBarEnd, setAppBarEnd] = useState(() => () => null);

  // Allow external control of darkMode (e.g., from Storybook)
  const effectiveDarkMode =
    overrideValue?.darkMode !== undefined ? overrideValue.darkMode : darkMode;

  // Sync external darkMode changes to localStorage
  useEffect(() => {
    if (overrideValue?.darkMode !== undefined && overrideValue.darkMode !== darkMode) {
      setDarkMode(overrideValue.darkMode);
    }
  }, [overrideValue?.darkMode, darkMode, setDarkMode]);

  function renderAppBarStart(fn) {
    setAppBarStart(() => fn);
  }
  function renderAppBarEnd(fn) {
    setAppBarEnd(() => fn);
  }

  return (
    <UIContext.Provider
      value={{
        appBarStart,
        renderAppBarStart,
        appBarEnd,
        renderAppBarEnd,
        darkMode: effectiveDarkMode,
        setDarkMode,
        navCollapsed,
        setNavCollapsed,
        pageTitle,
        setPageTitle,
        breadcrumbs,
        setBreadcrumbs,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
