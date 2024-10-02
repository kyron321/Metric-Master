import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { NextRequest } from "next/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({
  region: "eu-west-2",
});

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
};

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
`;

const server = new ApolloServer({
  resolvers,
  typeDefs,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

export { handler as GET, handler as POST };