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
    websites: async () => {
      const response = await ddbClient.send(
        new ScanCommand({
          TableName: "MetricMaster",
        })
      );

      return response.Items?.map((item) => unmarshall(item));
    },
  },
};

const typeDefs = gql`
  type PagespeedInsights {
    Accessibility: Float!
    BestPractices: Float!
    Performance: Float!
    SEO: Float!
  }

  type Website {
    WebsiteDomain: String!
    WebsiteID: Float!
    PagespeedInsights: PagespeedInsights!

  }
  type Query {
    websites: [Website]
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
