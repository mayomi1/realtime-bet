import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'
import { useStore } from '../store/useStore'

// Mock the entire store
vi.mock('../store/useStore', () => ({
  useStore: vi.fn()
}));

describe('Betting Flow', () => {
  const mockPlaceBet = vi.fn()
  const mockInitializeSocket = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks();

      // Setup authenticated store state
      (useStore as any).mockReturnValue({
      user: {
        id: '1',
        username: 'testuser',
        points: 1000
      },
      cleanup: vi.fn,
      games: [{
        id: '1',
        team1: 'Team A',
        team2: 'Team B',
        odds1: 1.5,
        odds2: 2.5,
        status: 'LIVE',
        score1: 0,
        score2: 0,
        timeRemaining: '90:00'
      }],
      bets: [],
      leaderboard: [],
      placeBet: mockPlaceBet.mockReturnValue({
          id: 1
      }),
      isPlaceBetLoading: false,
      placeBetError: null,
      initializeSocket: mockInitializeSocket
    })
  })

  it('completes betting flow successfully', async () => {
    render(<App />)

    // Find and fill bet form
    const amountInput = screen.getByPlaceholderText('Bet amount')
    fireEvent.change(amountInput, { target: { value: '100' } })

    // Select team
    const teamSelect = screen.getByRole('combobox')
    fireEvent.change(teamSelect, { target: { value: 'team1' } })

    // Place bet
    fireEvent.click(screen.getByRole('button', { name: 'Place Bet' }))

    // Verify bet placement
    await waitFor(() => {
      expect(mockPlaceBet).toHaveBeenCalledWith('1', 100, 'team1')
    })
  })
})
