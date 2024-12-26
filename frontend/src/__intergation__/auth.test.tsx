import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'
import { useStore } from '../store/useStore'

// Mock the entire store
vi.mock('../store/useStore', () => ({
  useStore: vi.fn()
}))

// Mock API calls
vi.mock('../api/auth', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn()
}))



describe('Authentication Flow', () => {
  const mockLoginFn = vi.fn()
  const mockRegisterFn = vi.fn()

  const initStore = {
    user: null,
    login: mockLoginFn,
    register: mockRegisterFn,
    isLoading: false,
    error: null,
    checkAuth: vi.fn,
    games: [],
    leaderboard: []
  }

  beforeEach(() => {
    vi.clearAllMocks();

      // Setup default store state
      (useStore as any).mockReturnValue(initStore)
  })

  it('completes the login flow successfully', async () => {
    // Mock successful login
    mockLoginFn.mockResolvedValueOnce({
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      points: 1000
    })

    render(<App />)

    // Check initial state
    expect(screen.getByTestId('login-header')).toHaveTextContent('Login')

    // Fill in login form
    fireEvent.change(screen.getByRole('textbox', { name: 'Email' }), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    })

    // Submit form
    fireEvent.submit(screen.getByRole('form'));

    // (useStore as any).mockReturnValue({
    //   ...initStore,
    //   isLoading: true
    // })
    // expect(screen.getByRole('button')).toHaveTextContent('Loading...')

    // Wait for navigation after successful login
    await waitFor(() => {
      expect(mockLoginFn).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('shows error message on failed login', async () => {
    // Mock failed login
    const errorMessage = 'Invalid credentials'

    render(<App />);

    (useStore as any).mockReturnValue({
      ...initStore,
      authError: errorMessage
    });
    // Fill and submit form
    fireEvent.change(screen.getByRole('textbox', { name: 'Email' }), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpassword' }
    })
    fireEvent.submit(screen.getByRole('form'))

    // Verify error is displayed
    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeDefined()
    })
  })

  it('completes the registration flow successfully', async () => {
    render(<App />)

    // Switch to register form
    fireEvent.click(screen.getByText('Register'))

    // Fill registration form
    fireEvent.change(screen.getByRole('textbox', { name: 'Username' }), {
      target: { value: 'newuser' }
    })
    fireEvent.change(screen.getByRole('textbox', { name: 'Email' }), {
      target: { value: 'newuser@example.com' }
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    })

    // Submit form
    fireEvent.submit(screen.getByRole('form'))

    // Verify registration call
    await waitFor(() => {
      expect(mockRegisterFn).toHaveBeenCalledWith(
        'newuser',
        'newuser@example.com',
        'password123'
      )
    })
  })

  it('navigates between login and register forms', async () => {
    render(<App />)

    // Check initial state
    expect(screen.getByTestId('login-header')).toHaveTextContent('Login')

    // Go to register
    fireEvent.click(screen.getByText('Register'))
    expect(screen.getByTestId('login-header')).toHaveTextContent('Register')

    // Go back to login
    fireEvent.click(screen.getByText('Login'))
    expect(screen.getByTestId('login-header')).toHaveTextContent('Login')
  })
})

// Test betting flow
// describe('Betting Flow', () => {
//   const mockPlaceBet = vi.fn()
//
//   beforeEach(() => {
//     vi.resetAllMocks()
//
//       // Setup authenticated store state
//       (useStore as any).mockReturnValue({
//       user: {
//         id: '1',
//         username: 'testuser',
//         points: 1000
//       },
//       games: [{
//         id: '1',
//         team1: 'Team A',
//         team2: 'Team B',
//         odds1: 1.5,
//         odds2: 2.5,
//         status: 'LIVE',
//         score1: 0,
//         score2: 0,
//         timeRemaining: '90:00'
//       }],
//       placeBet: mockPlaceBet,
//       isPlaceBetLoading: false,
//       placeBetError: null
//     })
//   })
//
//   it('completes betting flow successfully', async () => {
//     render(<App />)
//
//     // Find and fill bet form
//     const amountInput = screen.getByPlaceholderText('Bet amount')
//     fireEvent.change(amountInput, { target: { value: '100' } })
//
//     // Select team
//     const teamSelect = screen.getByRole('combobox')
//     fireEvent.change(teamSelect, { target: { value: 'team1' } })
//
//     // Place bet
//     fireEvent.click(screen.getByRole('button', { name: 'Place Bet' }))
//
//     // Verify bet placement
//     await waitFor(() => {
//       expect(mockPlaceBet).toHaveBeenCalledWith('1', 100, 'team1')
//     })
//   })
//
//   it('prevents betting when user has insufficient points', async () => {
//     // Update user points to be low
//     (useStore as any).mockReturnValue({
//       user: {
//         id: '1',
//         username: 'testuser',
//         points: 50
//       },
//       games: [{
//         id: '1',
//         team1: 'Team A',
//         team2: 'Team B',
//         odds1: 1.5,
//         odds2: 2.5,
//         status: 'LIVE'
//       }],
//       placeBet: mockPlaceBet
//     })
//
//     render(<App />)
//
//     // Attempt to place bet with more points than available
//     const amountInput = screen.getByPlaceholderText('Bet amount')
//     fireEvent.change(amountInput, { target: { value: '100' } })
//     fireEvent.click(screen.getByRole('button', { name: 'Place Bet' }))
//
//     // Verify error message
//     expect(screen.getByText("You don't have enough points to bet")).toBeInTheDocument()
//   })
// })
