"use client";

import { gql, useQuery, useMutation } from "@apollo/client";
import { Session } from "next-auth"; 

interface WebsitesProps {
  session: Session;
}

const GET_WEBSITES = gql`
  query GetWebsites($userId: String!) {
    websites(userId: $userId) {
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
`;

const DELETE_WEBSITE = gql`
  mutation DeleteWebsite($website: String!, $userId: String!) {
    deleteWebsite(website: $website, userId: $userId) {
      success
      message
    }
  }
`;

export const Websites = ({ session }: WebsitesProps) => {
  const userId = session?.uid;

  // Fetching websites with query
  const { data, loading, error, refetch } = useQuery(GET_WEBSITES, {
    variables: { userId },
    skip: !userId, // Skip the query if userId is not available
  });

  // Delete website mutation
  const [deleteWebsite, { loading: deleteLoading }] = useMutation(DELETE_WEBSITE, {
    onCompleted: () => {
      refetch(); // Refetch websites after a successful deletion
    },
    onError: (err) => {
      console.error("Error deleting website:", err);
    },
  });

  // Handler to delete a website
  const handleDelete = (website: string) => {
    if (!userId) return;
    deleteWebsite({
      variables: { website, userId },
    });
  };

  if (loading || deleteLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data?.websites?.map((d: any) => (
        <div key={d.website} className="flex items-center space-x-4">
          <img
            src={`https://www.google.com/s2/favicons?domain=${d.website}&sz=50`}
            alt={`Favicon for ${d.website}`}
          />{" "}
          <span>{d.website}</span>
          <span>Performance: {d.pagespeedInsights.performance}</span>
          <span>Accessibility: {d.pagespeedInsights.accessibility}</span>
          <span>Best Practices: {d.pagespeedInsights.bestPractices}</span>
          <span>SEO: {d.pagespeedInsights.seo}</span>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => handleDelete(d.website)}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ))}
    </div>
  );
};
