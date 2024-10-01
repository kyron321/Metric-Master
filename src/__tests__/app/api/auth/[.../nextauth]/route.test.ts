import { Session } from "next-auth"; // Ensure you import the Session type
import NextAuth from "next-auth"; // Ensure you import NextAuth

jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("NextAuth handler", () => {
  it("should add uid to the session object", async () => {
    const mockSession = { user: {} } as Session;
    const mockToken = { sub: "12345" };
    const mockUser = {};

    // Define the type for the argument
    type NextAuthArgs = {
      callbacks: {
        session: (params: { session: Session; token: any; user: any }) => Session;
      };
    };

    // Mock the session callback
    const mockNextAuth = jest.fn().mockImplementation(({ callbacks }: NextAuthArgs) => {
      return callbacks.session({ session: mockSession, token: mockToken, user: mockUser });
    });

    (NextAuth as jest.Mock).mockImplementation(mockNextAuth);

    // Call the handler
    const handler = require("@/app/api/auth/[...nextauth]/route").default;
    await handler;

    // Check if the session object has the uid
    expect(mockSession.uid).toBe("12345");
  });
});