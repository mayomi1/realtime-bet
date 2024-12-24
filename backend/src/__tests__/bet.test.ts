import { BetService } from '../services/betService';
import { mockBetRepository, mockGameRepository, mockUserRepository } from '../__mocks__/repositories';
import {IUserRepository} from "../repositories/userRepository";
import {BetRequestDTO} from "../types";

describe('Bet Service', () => {
  let betService: BetService;

  beforeEach(() => {
    jest.clearAllMocks();
    betService = new BetService(mockBetRepository, mockGameRepository, mockUserRepository as unknown as IUserRepository);
  });

  describe('placeBet', () => {
    const betData = {
      gameId: 1,
      amount: 100,
      team: 'team1'
    } as  BetRequestDTO;

    it('should place bet successfully', async () => {
      mockGameRepository.findById.mockResolvedValue({
        id: 1,
        odds1: 1.5,
        odds2: 2.0,
        status: 'LIVE'
      });

      mockBetRepository.create.mockResolvedValue({
        id: 1,
        userId: 1,
        ...betData
      });

      mockUserRepository.updatePoints({
        userId: 1, amount: 20
      })

      const result = await betService.placeBet( 1, betData);

      expect(result).toHaveProperty('id');
      expect(mockBetRepository.create).toHaveBeenCalled();
    });

    it('should throw if game not found', async () => {
      mockGameRepository.findById.mockResolvedValue(null);

      await expect(betService.placeBet(1, betData))
        .rejects
        .toThrow('Game not found');
    });
  });
});
