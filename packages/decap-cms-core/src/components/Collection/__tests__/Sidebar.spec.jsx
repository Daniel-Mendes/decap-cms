import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { fromJS } from 'immutable';

import { Sidebar } from '../Sidebar';

vi.mock('decap-cms-ui-default', async () => {
  const actual = await vi.importActual('decap-cms-ui-default');
  return {
    ...actual,
    Icon: 'mocked-icon',
  };
});

vi.mock('../NestedCollection', () => ({
  default: 'nested-collection',
}));
vi.mock('../CollectionSearch', () => ({
  default: 'collection-search',
}));
vi.mock('../../../actions/collections');

describe('Sidebar', () => {
  const props = {
    searchTerm: '',
    isSearchEnabled: true,
    t: vi.fn(key => key),
  };
  it('should render sidebar with a simple collection', () => {
    const collections = fromJS([{ name: 'posts', label: 'Posts' }]).toOrderedMap();
    const { asFragment, getByTestId } = render(
      <MemoryRouter>
        <Sidebar {...props} collections={collections} />
      </MemoryRouter>,
    );

    expect(getByTestId('posts')).toHaveTextContent('Posts');
    expect(getByTestId('posts')).toHaveAttribute('href', '/collections/posts');

    expect(asFragment()).toMatchSnapshot();
  });

  it('should not render a hidden collection', () => {
    const collections = fromJS([{ name: 'posts', label: 'Posts', hide: true }]).toOrderedMap();
    const { queryByTestId } = render(
      <MemoryRouter>
        <Sidebar {...props} collections={collections} />
      </MemoryRouter>,
    );

    expect(queryByTestId('posts')).toBeNull();
  });

  it('should render sidebar with a nested collection', () => {
    const collections = fromJS([
      { name: 'posts', label: 'Posts', nested: { depth: 10 } },
    ]).toOrderedMap();
    const { asFragment } = render(
      <MemoryRouter>
        <Sidebar {...props} collections={collections} />
      </MemoryRouter>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render nested collection with filterTerm', () => {
    const collections = fromJS([
      { name: 'posts', label: 'Posts', nested: { depth: 10 } },
    ]).toOrderedMap();
    const { asFragment } = render(
      <MemoryRouter>
        <Sidebar {...props} collections={collections} filterTerm="dir1/dir2" />
      </MemoryRouter>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render sidebar without search', () => {
    const collections = fromJS([{ name: 'posts', label: 'Posts' }]).toOrderedMap();
    const { asFragment } = render(
      <MemoryRouter>
        <Sidebar {...props} collections={collections} isSearchEnabled={false} />
      </MemoryRouter>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
