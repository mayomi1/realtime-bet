export const mockUserRepository = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  updatePoints: jest.fn(),
};

export const mockGameRepository = {
  findById: jest.fn(),
  findLiveGames: jest.fn()
};

export const mockBetRepository = {
  create: jest.fn(),
  findByUserId: jest.fn()
};
