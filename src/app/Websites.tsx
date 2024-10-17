"use client";

import { gql, useQuery, useMutation } from "@apollo/client";
import { Session } from "next-auth";
import React, { useState } from "react";
import Modal from "./Modal";
import PageSpeed from "@/components/Pagespeed";
import BinIcon from "./assets/icons/BinIcon";
import Link from "next/link";
import Loader from "@/components/Loader"

interface WebsitesProps {
  session: Session;
}

const GET_WEBSITES = gql`
  query GetWebsites($userId: String!) {
    websites(userId: $userId) {
      website
      userId
      fullUrl
      pagespeedInsightsMobile {
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_WEBSITES, {
    variables: { userId },
    skip: !userId,
  });

  const [deleteWebsite, { loading: deleteLoading }] = useMutation(
    DELETE_WEBSITE,
    {
      onCompleted: () => {
        refetch();
      },
      onError: (err) => {
        console.error("Error deleting website:", err);
      },
    }
  );

  const handleDelete = (website: string) => {
    if (!userId) return;
    deleteWebsite({
      variables: { website, userId },
    });
  };

  if (loading || deleteLoading) return <p><Loader/></p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="rounded-lg p-8 bg-gray-900 pt-28">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-mm-white">Websites</h2>
        <button
          className="bg-secondary hover:bg-secondary-dark transition-colors text-mm-white px-4 py-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add a Website 
        </button>
      </div>
      <section className="space-y-4">
        {data?.websites?.length === 0 ? (
          <p className="text-mm-white">You have no websites linked to your account.</p>
        ) : (
          data?.websites?.map((d: any) => (
            <div
              key={d.website}
              className="bg-gray-700 shadow-md rounded-lg p-4 flex items-center space-x-4"
            >
              <img
                src={`https://www.google.com/s2/favicons?domain=${d.fullUrl}&sz=50`}
                alt={`Favicon for ${d.website}`}
                className="w-8 h-8"
              />
              <div className="flex-1">
                <span className="text-lg font-semibold text-mm-white">
                  {d.website}
                </span>
                <div className="flex space-x-4 mt-1">
                  <span className="text-sm text-mm-white">
                    Performance:{" "}
                    {d.pagespeedInsightsMobile.performance.slice(-1)[0]}
                  </span>
                  <span className="text-sm text-mm-white">
                    Accessibility:{" "}
                    {d.pagespeedInsightsMobile.accessibility.slice(-1)[0]}
                  </span>
                  <span className="text-sm text-mm-white">
                    Best Practices:{" "}
                    {d.pagespeedInsightsMobile.bestPractices.slice(-1)[0]}
                  </span>
                  <span className="text-sm text-mm-white">
                    SEO: {d.pagespeedInsightsMobile.seo.slice(-1)[0]}
                  </span>
                </div>
              </div>

              <Link href={`/analytics/${d.website}`}>
              <button className="bg-mm-grey hover:bg-mm-grey-dark transition-colors text-mm-white px-4 py-2 rounded">
                  View Analytics
              </button>
              </Link>
              <a
                  className="flex gap-2"
                  href={`${d.fullUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
              <button className="bg-mm-grey hover:bg-mm-grey-dark transition-colors text-mm-white px-4 py-2 rounded">
                  Visit Website
              </button>
              </a>
              <button
                className="bg-mm-red hover:bg-mm-red-dark text-mm-white px-4 py-2 rounded transition-colors"
                onClick={() => handleDelete(d.website)}
                disabled={deleteLoading}
              >
                <BinIcon />
              </button>
            </div>
          ))
        )}
      </section>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PageSpeed session={session} />
      </Modal>
    </div>
  );
};