import { createMocks } from 'node-mocks-http';
import { GET as handler } from '@/app/api/auth/[...nextauth]/route'; // Adjust the path to your API route

describe('NextAuth handler', () => {
  beforeAll(() => {
    // Set necessary environment variables
    process.env.GOOGLE_CLIENT_ID = 'your-google-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'your-google-client-secret';
  });

  it('should respond to a GET request', async () => {
    const { req, res } = createMocks({
      method: 'GET', // Simulate a GET request
      query: { nextauth: ['session'] }, // Mock the query property
    });

    await handler(req, res); // Call your API handler

    expect(res.statusCode).toBe(200); // Expect a 200 status code
  });
});