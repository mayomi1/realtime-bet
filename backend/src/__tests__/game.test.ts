import { GameService } from '../services/gameService';
import { mockGameRepository } from '../__mocks__/repositories';

describe('Game Service', () => {
  let gameService: GameService;

  beforeEach(() => {
    jest.clearAllMocks();
    gameService = new GameService(mockGameRepository);
  });

  it('should fetch live games', async () => {
    const mockGames = [
      { id: 1, status: 'LIVE' },
      { id: 2, status: 'LIVE' }
    ];

    mockGameRepository.findLiveGames.mockResolvedValue(mockGames);

    const result = await gameService.getLiveGames();

    expect(result).toEqual(mockGames);
    expect(mockGameRepository.findLiveGames).toHaveBeenCalled();
  });
});
