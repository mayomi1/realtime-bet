import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Leaderboard } from '../components/Leaderboard'
import { useStore } from '../store/useStore'
import { LeaderboardEntry } from '../types/api'

// Mock the useStore hook
vi.mock('../store/useStore', () => ({
  useStore: vi.fn()
}))

describe('Leaderboard', () => {
  const mockLeaderboard: LeaderboardEntry[] = [
    {
      userId: '1',
      userName: 'John Doe',
      points: 1000
    },
    {
      userId: '2',
      userName: 'Jane Smith',
      points: 850
    },
    {
      userId: '3',
      userName: 'Bob Wilson',
      points: 750
    }
  ]

  beforeEach(() => {
      vi.clearAllMocks();
      // Setup default store state
      (useStore as any).mockReturnValue({
      leaderboard: mockLeaderboard
    })
  })

  it('renders the leaderboard title', () => {
    render(<Leaderboard />)
    expect(screen.getByText('Leaderboard')).toBeDefined()
  })

  it('renders all leaderboard entries with correct ranking', () => {
    render(<Leaderboard />)

    // Check if all usernames are rendered
    expect(screen.getByText('John Doe')).toBeDefined()
    expect(screen.getByText('Jane Smith')).toBeDefined()
    expect(screen.getByText('Bob Wilson')).toBeDefined()

    // Check if rankings are rendered correctly
    expect(screen.getByText('1.')).toBeDefined()
    expect(screen.getByText('2.')).toBeDefined()
    expect(screen.getByText('3.')).toBeDefined()
  })

  it('renders points with correct formatting', () => {
    render(<Leaderboard />)

    // Check if points are rendered with proper formatting
    expect(screen.getByText('1,000 pts')).toBeDefined()
    expect(screen.getByText('850 pts')).toBeDefined()
    expect(screen.getByText('750 pts')).toBeDefined()
  })

  it('renders empty leaderboard when no entries exist', () => {
    // Mock empty leaderboard
    (useStore as any).mockReturnValue({
      leaderboard: []
    })

    render(<Leaderboard />)

    // Title should still be present
    expect(screen.getByText('Leaderboard')).toBeDefined()

    // No usernames or points should be rendered
    expect(screen.queryByText('pts')).toBeNull()
  })

  it('maintains correct order of leaderboard entries', () => {
    render(<Leaderboard />)

    const entries = screen.getAllByText(/pts/)
    expect(entries[0]).toHaveTextContent('1,000 pts')
    expect(entries[1]).toHaveTextContent('850 pts')
    expect(entries[2]).toHaveTextContent('750 pts')
  })

  it('renders each entry with correct class names', () => {
    render(<Leaderboard />)

    // Get all entry containers
    const entries = screen.getAllByText(/pts/).map(el => el.parentElement)

    entries.forEach(entry => {
      expect(entry).toHaveClass('flex', 'justify-between', 'items-center', 'p-2', 'hover:bg-gray-50')
    })
  })
})
