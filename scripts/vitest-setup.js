import { afterEach, vi } from 'vitest';
import 'vitest-canvas-mock';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});

// Mock implementation of window.scrollTo
const windowMock = {
  scrollTo: vi.fn(),
};

// Assign the mock to the global object
Object.assign(globalThis, windowMock);

// Emotion setup for tests
import { cache } from '@emotion/css';
import { CacheProvider } from '@emotion/react';
import { beforeEach } from 'vitest';

// Clear emotion cache before each test
beforeEach(() => {
  cache.sheet.flush();
});

// Mock URL.createObjectURL for SVG and image handling
global.URL.createObjectURL = vi.fn(() => 'mocked-url');
global.URL.revokeObjectURL = vi.fn();
