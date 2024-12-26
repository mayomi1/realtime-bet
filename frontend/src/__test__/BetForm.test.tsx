import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BetForm } from '../components/BetForm'
import { useStore } from '../store/useStore'
import { toast } from 'sonner'

// Mock the dependencies
vi.mock('../store/useStore', () => ({
  useStore: vi.fn()
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('BetForm', () => {
  const mockPlaceBet = vi.fn()
  const defaultProps = { gameId: '123' }

  beforeEach(() => {
      vi.clearAllMocks();
      // Mock the useStore implementation
      (useStore as any).mockReturnValue({
      placeBet: mockPlaceBet.mockReturnValue({
        id: 1
      }),
      checkAuth: vi.fn,
      isPlaceBetLoading: false,
      placeBetError: null,
      user: { points: 1000 }
    })
  })

  it('should render form elements', () => {
    render(<BetForm {...defaultProps} />)

    expect(screen.getByPlaceholderText('Bet amount')).toBeDefined()
    expect(screen.getByRole('combobox')).toBeDefined()
    expect(screen.getByRole('button')).toBeDefined()
  })

  it('should handle bet amount input', () => {
    render(<BetForm {...defaultProps} />)

    const input = screen.getByPlaceholderText('Bet amount')
    fireEvent.change(input, { target: { value: '500' } })

    expect(input).toHaveValue(500)
  })

  it('should handle team selection', () => {
    render(<BetForm {...defaultProps} />)

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'team2' } })

    expect(select).toHaveValue('team2')
  })

  it('should submit bet when user has enough points', async () => {
    render(<BetForm {...defaultProps} />)

    const input = screen.getByPlaceholderText('Bet amount')
    fireEvent.change(input, { target: { value: '500' } })

    const form = screen.getByRole('form')
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockPlaceBet).toHaveBeenCalledWith('123', 500, 'team1')
      expect(toast.success).toHaveBeenCalledWith('Bet placed')
    })
  })

  it('should show error when user has insufficient points', async () => {
    (useStore as any).mockReturnValue({
      placeBet: mockPlaceBet,
      isPlaceBetLoading: false,
      placeBetError: null,
      user: { points: 100 }
    })

    render(<BetForm {...defaultProps} />)

    const input = screen.getByPlaceholderText('Bet amount')
    fireEvent.change(input, { target: { value: '500' } })

    const form = screen.getByRole('form')
    fireEvent.submit(form)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("You don't have enough points to bet")
    })
  })
})
