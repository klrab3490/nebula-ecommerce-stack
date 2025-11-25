// Simple Prisma mock for testing
// Must use 'mock' prefix for Jest mock factory
const mockPrisma: any = {
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  bundle: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
  },
  address: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  order: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  productFAQ: {
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  bundleProduct: {
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn((callback: any): any => callback(mockPrisma)),
};

// Mock the prisma module
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  prisma: mockPrisma,
}));

// Export with the expected name for tests
export const prismaMock = mockPrisma;
export default mockPrisma;

// Placeholder test to satisfy Jest
describe("Prisma Mock", () => {
  it("exports prisma mock", () => {
    expect(prismaMock).toBeDefined();
  });
});
