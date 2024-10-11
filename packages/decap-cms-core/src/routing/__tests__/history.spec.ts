import { createHashHistory } from 'history';
import { vi } from 'vitest';

import type { History } from 'history';

import { navigateToCollection, navigateToEntry, navigateToNewEntry } from '../history';

vi.mock('history');

const history = { push: vi.fn(), replace: vi.fn() } as unknown as History;
const mockedCreateHashHistory = vi.mocked(createHashHistory);
mockedCreateHashHistory.mockReturnValue(history);

describe('history', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('navigateToCollection', () => {
    it('should push route', () => {
      navigateToCollection('posts');
      expect(history.push).toHaveBeenCalledTimes(1);
      expect(history.push).toHaveBeenCalledWith('/collections/posts');
    });
  });

  describe('navigateToNewEntry', () => {
    it('should replace route', () => {
      navigateToNewEntry('posts');
      expect(history.replace).toHaveBeenCalledTimes(1);
      expect(history.replace).toHaveBeenCalledWith('/collections/posts/new');
    });
  });

  describe('navigateToEntry', () => {
    it('should replace route', () => {
      navigateToEntry('posts', 'index');
      expect(history.replace).toHaveBeenCalledTimes(1);
      expect(history.replace).toHaveBeenCalledWith('/collections/posts/entries/index');
    });
  });
});
