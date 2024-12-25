import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '../components/LoginForm'
import { useStore } from '../store/useStore'

// Mock useStore
vi.mock('../store/useStore', () => ({
  useStore: vi.fn()
}))

describe('LoginForm', () => {
  const mockLogin = vi.fn()
  const mockRegister = vi.fn()

  beforeEach(() => {
      vi.clearAllMocks();

      // Default mock implementation
      (useStore as any).mockReturnValue({
      login: mockLogin,
      register: mockRegister,
      isLoading: false,
      error: null
    })
  })

  it('renders login form by default', () => {
    render(<LoginForm />)

    // Check form elements
    expect(screen.getByRole('heading', { name: 'Login' })).toBeDefined()
    expect(screen.getByLabelText('Email')).toBeDefined()
    expect(screen.getByLabelText('Password')).toBeDefined()
    expect(screen.queryByLabelText('Username')).toBeNull()
    expect(screen.getByRole('button', { name: 'Login' })).toBeDefined()
  })

  it('switches to register form when register link is clicked', async () => {
    render(<LoginForm />)

    // Click register link
    fireEvent.click(screen.getByTestId('click-register-switch'))

    // Check if form switched to register mode
    expect(screen.getByRole('heading', { name: 'Register' })).toBeDefined()
    expect(screen.getByLabelText('Username')).toBeDefined()
    expect(screen.getByLabelText('Email')).toBeDefined()
    expect(screen.getByLabelText('Password')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Register' })).toBeDefined()
  })

  it('handles login submission correctly', async () => {
    render(<LoginForm />)

    // Fill form
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    })

    // Submit form
    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('handles register submission correctly', async () => {
    render(<LoginForm />)

    // Switch to register mode
    fireEvent.click(screen.getByText('Register'))

    // Fill form
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'testuser' }
    })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    })

    // Submit form
    fireEvent.submit(screen.getByRole('form'))

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123')
    })
  })

  it('displays loading state while submitting', () => {
    (useStore as any).mockReturnValue({
      login: mockLogin,
      register: mockRegister,
      isLoadingAuth: true,
      error: null
    })

    render(<LoginForm />)

    expect(screen.getByRole('button', { name: 'Loading...' })).toBeDefined()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('displays error message when error exists', () => {
    const errorMessage = 'Invalid credentials';

    (useStore as any).mockReturnValue({
      login: mockLogin,
      register: mockRegister,
      isLoading: false,
      authError: errorMessage
    })

    render(<LoginForm />)

    expect(screen.getByText(errorMessage)).toBeDefined()
  })

  it('switches back to login form from register form', () => {
    render(<LoginForm />);

    // Switch to register
    fireEvent.click(screen.getByTestId('click-register-switch'))

    // Switch back to login
    fireEvent.click(screen.getByTestId('click-login-switch'))

    expect(screen.getByRole('heading', { name: 'Login' })).toBeDefined()
    expect(screen.queryByLabelText('Username')).toBeNull()
  })
})
