import fetch from "node-fetch";

describe("GraphQL API handler (integration test)", () => {
  it("should return 200 status code", async () => {
    const response = await fetch("http://localhost:3000/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    expect(data).toHaveProperty("data");
  });
});

describe("GraphQL API handler (integration test)", () => {
  it("should return websites data", async () => {
    const userId = "1"; // Replace with a valid user ID for testing

    const response = await fetch("http://localhost:3000/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetWebsites($userId: String!) {
            websites(userId: $userId) {
              website
              userId
              pagespeedInsightsMobile {
                accessibility
                bestPractices
                performance
                seo
              }
            }
          }
        `,
        variables: {
          userId,
        },
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("data");
    expect(data.data).toHaveProperty("websites");
  });
});
