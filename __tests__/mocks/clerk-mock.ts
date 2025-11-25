// Mock Clerk authentication
export const mockCurrentUser = jest.fn();
export const mockAuth = jest.fn();

jest.mock("@clerk/nextjs/server", () => ({
  currentUser: () => mockCurrentUser(),
  auth: () => mockAuth(),
}));

// Helper to set up authenticated user
export const setAuthenticatedUser = (role: string = "customer") => {
  mockCurrentUser.mockResolvedValue({
    id: "user_test123",
    emailAddresses: [{ emailAddress: "test@example.com" }],
    firstName: "Test",
    lastName: "User",
    publicMetadata: { role },
  });

  mockAuth.mockReturnValue({
    userId: "user_test123",
    sessionId: "session_test123",
  });
};

// Helper to set up unauthenticated user
export const setUnauthenticatedUser = () => {
  mockCurrentUser.mockResolvedValue(null);
  mockAuth.mockReturnValue({
    userId: null,
    sessionId: null,
  });
};

// Helper to set up seller/admin user
export const setSellerUser = () => {
  setAuthenticatedUser("seller");
};

export const setAdminUser = () => {
  setAuthenticatedUser("admin");
};

// Reset mocks
export const resetAuthMocks = () => {
  mockCurrentUser.mockReset();
  mockAuth.mockReset();
};
