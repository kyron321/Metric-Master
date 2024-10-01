import fetch from 'node-fetch';

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

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('data');
  });
});

describe('GraphQL API handler (integration test)', () => {
  it('should return websites data', async () => {
    const response = await fetch('http://localhost:3000/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            websites {
              website
              userId
              pagespeedInsights {
                accessibility
                bestPractices
                performance
                seo
              }
            }
          }
        `,
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('data'); 
  });
});