import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the entire history module before importing
vi.mock('history', () => ({
  createHashHistory: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
}));

import { createHashHistory } from 'history';
import type { History } from 'history';
import { navigateToCollection, navigateToEntry, navigateToNewEntry, history } from '../history';

const mockedCreateHashHistory = vi.mocked(createHashHistory);
const mockedHistory = history as unknown as {
  push: ReturnType<typeof vi.fn>;
  replace: ReturnType<typeof vi.fn>;
};

describe('history', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('navigateToCollection', () => {
    it('should push route', () => {
      navigateToCollection('posts');
      expect(mockedHistory.push).toHaveBeenCalledTimes(1);
      expect(mockedHistory.push).toHaveBeenCalledWith('/collections/posts');
    });
  });

  describe('navigateToNewEntry', () => {
    it('should replace route', () => {
      navigateToNewEntry('posts');
      expect(mockedHistory.replace).toHaveBeenCalledTimes(1);
      expect(mockedHistory.replace).toHaveBeenCalledWith('/collections/posts/new');
    });
  });

  describe('navigateToEntry', () => {
    it('should replace route', () => {
      navigateToEntry('posts', 'hello-world');
      expect(mockedHistory.replace).toHaveBeenCalledTimes(1);
      expect(mockedHistory.replace).toHaveBeenCalledWith('/collections/posts/entries/hello-world');
    });
  });
});
