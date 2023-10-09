"use client";

import { gql, useQuery, useMutation } from "@apollo/client";
import { Session } from "next-auth";
import React, { useState } from "react";
import Modal from "./Modal";
import PageSpeed from "@/components/Pagespeed";
import BinIcon from "./assets/icons/BinIcon";
import Link from "next/link";

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

  if (loading || deleteLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="shadow-lg rounded-lg p-8 bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Websites</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add a Website
        </button>
      </div>
      <section className="space-y-4">
        {data?.websites?.map((d: any) => (
          <div
            key={d.website}
            className="bg-gray-700 shadow-md rounded-lg p-4 flex items-center space-x-4"
          >
            <img
              src={`https://www.google.com/s2/favicons?domain=${d.website}&sz=50`}
              alt={`Favicon for ${d.website}`}
              className="w-8 h-8"
            />
            <div className="flex-1">
              <span className="text-lg font-semibold text-white">
                {d.website.replace(/^https?:\/\//, "").split('.')[0]}
              </span>
              <div className="flex space-x-4 mt-1">
                <span className="text-sm text-gray-300">
                  Performance: {d.pagespeedInsights.performance}
                </span>
                <span className="text-sm text-gray-300">
                  Accessibility: {d.pagespeedInsights.accessibility}
                </span>
                <span className="text-sm text-gray-300">
                  Best Practices: {d.pagespeedInsights.bestPractices}
                </span>
                <span className="text-sm text-gray-300">
                  SEO: {d.pagespeedInsights.seo}
                </span>
              </div>
            </div>

            <button className="bg-gray-800 text-white px-3 py-1 rounded">
              <Link href={`/analytics/${d.website.replace(/^https?:\/\//, "").split('.')[0]}`}>
                View Analytics
              </Link>
            </button>
            <button className="bg-gray-800 text-white px-3 py-1 rounded">
              <a
                className="flex gap-2"
                href={`${d.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Website
              </a>
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => handleDelete(d.website)}
              disabled={deleteLoading}
            >
              <BinIcon />
            </button>
          </div>
        ))}
      </section>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PageSpeed session={session} />
      </Modal>
    </div>
  );
};