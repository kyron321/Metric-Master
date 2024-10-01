import fetch from 'node-fetch'; // Install using: npm install node-fetch

describe('GraphQL API handler (integration test)', () => {
  it('should return 200 status code', async () => {
    const response = await fetch('http://localhost:3000/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            __typename
          }
        `,
      }),
    });

    expect(response.status).toBe(200); // Ensure status is 200
    const data = await response.json();
    expect(data).toHaveProperty('data'); // Ensure the response contains data
  });
});
