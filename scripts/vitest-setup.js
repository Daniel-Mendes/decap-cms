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
