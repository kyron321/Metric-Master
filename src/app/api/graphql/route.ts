import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { NextRequest } from "next/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { DynamoDBClient, ScanCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({
  region: "eu-west-2",
});

// Resolvers
const resolvers = {
  Query: {
    websites: async (_: any, { userId }: { userId: string }) => {
      const response = await ddbClient.send(
        new ScanCommand({
          TableName: "Metrics",
        })
      );

      const items = response.Items?.map((item) => unmarshall(item));
      return items?.filter((item) => item.userId === userId);
    },
  },
  Mutation: {
    updatePageSpeed: async (
      _: any,
      {
        website,
        userId,
        accessibility,
        bestPractices,
        performance,
        seo,
      }: {
        website: string;
        userId: string;
        accessibility: number;
        bestPractices: number;
        performance: number;
        seo: number;
      }
    ) => {
      const item = {
        website,
        userId,
        pagespeedInsights: {
          accessibility,
          bestPractices,
          performance,
          seo,
        },
      };

      await ddbClient.send(
        new PutItemCommand({
          TableName: "Metrics",
          Item: marshall(item),
        })
      );

      return item;
    },
  },
};

// Type Definitions (Schema)
const typeDefs = gql`
  type PagespeedInsights {
    accessibility: Float!
    bestPractices: Float!
    performance: Float!
    seo: Float!
  }

  type Website {
    website: String!
    userId: String!
    pagespeedInsights: PagespeedInsights!
  }

  type Query {
    websites(userId: String!): [Website]
  }

  type Mutation {
    updatePageSpeed(
      website: String!
      userId: String!
      accessibility: Float!
      bestPractices: Float!
      performance: Float!
      seo: Float!
    ): Website
  }
`;

// Apollo Server Setup
const server = new ApolloServer({
  resolvers,
  typeDefs,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

// Handler for Next.js API Routes
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

export { handler as GET, handler as POST };
