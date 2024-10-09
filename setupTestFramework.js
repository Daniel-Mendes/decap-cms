/* eslint-disable @emotion/no-vanilla */
import '@testing-library/jest-dom/extend-expect';
import fetch from 'node-fetch';

jest.mock('path', () => {
  const actual = jest.requireActual('path');
  return {
    ...actual.posix,
  };
});

globalThis.fetch = fetch;
globalThis.URL.createObjectURL = jest.fn();
