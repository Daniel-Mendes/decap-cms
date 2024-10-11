import * as api from '../API';
import { describe, it, expect } from 'vitest';

describe('Api', () => {
  describe('getPreviewStatus', () => {
    it('should return preview status on matching context', () => {
      expect(api.getPreviewStatus([{ context: 'deploy' }])).toEqual({ context: 'deploy' });
    });

    it('should return undefined on matching context', () => {
      expect(api.getPreviewStatus([{ context: 'other' }])).toBeUndefined();
    });
  });
});
