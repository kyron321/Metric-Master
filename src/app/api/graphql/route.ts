import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { NextRequest } from "next/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";

// DynamoDB Client setup
const ddbClient = new DynamoDBClient({
  region: "eu-west-2",
});

// Resolvers for the GraphQL API
const resolvers = {
  Query: {
    // Fetch websites by userId
    websites: async (_: any, { userId }: { userId: string }) => {
      const response = await ddbClient.send(
        new ScanCommand({
          TableName: "Metrics",
        })
      );

      const items = response.Items?.map((item) => unmarshall(item));
      return items?.filter((item) => item.userId === userId);
    },
    // Fetch a single website by userId and website
    website: async (_: any, { userId, website }: { userId: string; website: string }) => {
      const response = await ddbClient.send(
        new ScanCommand({
          TableName: "Metrics",
        })
      );

      const items = response.Items?.map((item) => unmarshall(item));
      return items?.find((item) => item.userId === userId && item.website === website);
    },
  },

  Mutation: {
    // Mutation to update PageSpeed data for a website
    updatePageSpeed: async (
      _: any,
      {
        website,
        userId,
        fullUrl,
        accessibility,
        bestPractices,
        performance,
        seo,
      }: {
        website: string;
        userId: string;
        fullUrl: string;
        accessibility: number;
        bestPractices: number;
        performance: number;
        seo: number;
      }
    ) => {
      const item = {
        website,
        userId,
        fullUrl,
        pagespeedInsightsMobile: {
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

    deleteWebsite: async (
      _: any,
      { website, userId }: { website: string; userId: string }
    ) => {
      await ddbClient.send(
        new DeleteItemCommand({
          TableName: "Metrics",
          Key: marshall({
            website,
            userId,
          }),
        })
      );

      return {
        success: true,
        message: `Website ${website} successfully deleted.`,
      };
    },
  },
};

// GraphQL Schema Definition
const typeDefs = gql`
  type pagespeedInsightsMobile {
    accessibility: Float!
    bestPractices: Float!
    performance: Float!
    seo: Float!
  }

  type Website {
    website: String!
    userId: String!
    fullUrl: String!
    pagespeedInsightsMobile: pagespeedInsightsMobile!
  }

  type Query {
    websites(userId: String!): [Website]
    website(userId: String!, website: String!): Website
  }

  type Mutation {
    updatePageSpeed(
      website: String!
      userId: String!
      fullUrl: String!
      accessibility: Float!
      bestPractices: Float!
      performance: Float!
      seo: Float!
    ): Website

    deleteWebsite(website: String!, userId: String!): DeleteResponse
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
  }
`;

// Apollo Server Setup
const server = new ApolloServer({
  resolvers,
  typeDefs,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

// Next.js API Handler for GraphQL
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

export { handler as GET, handler as POST };