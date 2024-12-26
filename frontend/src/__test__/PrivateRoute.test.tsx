import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PrivateRoute } from '../components/PrivateRoute';
import { useStore } from '../store/useStore';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../store/useStore');

describe('PrivateRoute', () => {
  const mockChildText = 'Protected Content';
  const Child = () => <div>{mockChildText}</div>;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render loading state when authentication is checking', () => {
    vi.mocked(useStore).mockReturnValue({
      isLoading: true,
      user: null,
      checkAuth: vi.fn()
    } as any);

    render(
      <BrowserRouter>
        <PrivateRoute>
          <Child />
        </PrivateRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render children when user is authenticated', () => {
    vi.mocked(useStore).mockReturnValue({
      isLoading: false,
      user: { id: '1' },
      checkAuth: vi.fn()
    } as any);

    render(
      <BrowserRouter>
        <PrivateRoute>
          <Child />
        </PrivateRoute>
      </BrowserRouter>
    );

    expect(screen.getByText(mockChildText)).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    vi.mocked(useStore).mockReturnValue({
      isLoading: false,
      user: null,
      checkAuth: vi.fn()
    } as any);

    const { container } = render(
      <BrowserRouter>
        <PrivateRoute>
          <Child />
        </PrivateRoute>
      </BrowserRouter>
    );

    expect(container.innerHTML).toBe('');
    expect(window.location.pathname).toBe('/login');
  });
});
