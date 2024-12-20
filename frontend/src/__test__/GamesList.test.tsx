import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GamesList } from '../components/GamesList'
import { useStore } from '../store/useStore'

vi.mock('../store/useStore', () => ({
  useStore: vi.fn()
}))

vi.mock('../components/BetForm', () => ({
  BetForm: ({ gameId }: { gameId: string }) => <div data-testid={`bet-form-${gameId}`}>Bet Form</div>
}))

describe('GamesList', () => {
  const mockGames = [
    {
      id: '1',
      team1: 'Team A',
      team2: 'Team B',
      score1: 2,
      score2: 1,
      odds1: 1.5,
      odds2: 2.5,
      timeRemaining: '45:00',
      status: 'LIVE'
    },
    {
      id: '2',
      team1: 'Team C',
      team2: 'Team D',
      score1: 0,
      score2: 0,
      odds1: 1.8,
      odds2: 2.2,
      timeRemaining: '90:00',
      status: 'FINISHED'
    }
  ]

  beforeEach(() => {
      vi.clearAllMocks();
      (useStore as any).mockReturnValue({
      games: mockGames
    })
  })

  it('renders all games with their details', () => {
    render(<GamesList />)

    // Check if team names are rendered
    expect(screen.getByText('Team A vs Team B')).toBeDefined()
    expect(screen.getByText('Team C vs Team D')).toBeDefined()

    // Check if scores are rendered
    expect(screen.getByText('2 - 1')).toBeDefined()
    expect(screen.getByText('0 - 0')).toBeDefined()

    // Check if odds are rendered
    expect(screen.getByText('1: 1.50')).toBeDefined()
    expect(screen.getByText('2: 2.50')).toBeDefined()
    expect(screen.getByText('1: 1.80')).toBeDefined()
    expect(screen.getByText('2: 2.20')).toBeDefined()

    // Check if time remaining is rendered
    expect(screen.getByText('45:00')).toBeDefined()
    expect(screen.getByText('90:00')).toBeDefined()
  })

  it('renders BetForm only for LIVE games', () => {
    render(<GamesList />)

    // Check if BetForm is rendered for LIVE game
    expect(screen.getByTestId('bet-form-1')).toBeDefined()

    // Check if BetForm is not rendered for FINISHED game
    expect(screen.queryByTestId('bet-form-2')).toBeNull()
  })

  it('renders empty state when no games are available', () => {
    // Mock empty games array
    (useStore as any).mockReturnValue({
      games: []
    })

    render(<GamesList />)

    // Verify no game data is rendered
    expect(screen.queryByText(/vs/)).toBeNull()
  })

  it('renders with correct formatting for odds', () => {
    render(<GamesList />)

    // Check if odds are formatted to 2 decimal places
    expect(screen.getByText('1: 1.50')).toBeDefined()
    expect(screen.getByText('2: 2.50')).toBeDefined()
  })

  it('renders time remaining for each game', () => {
    render(<GamesList />)

    const timeElements = screen.getAllByText(/:\d{2}/)
    expect(timeElements).toHaveLength(2)
  })
})
