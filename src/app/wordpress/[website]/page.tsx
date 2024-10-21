"use client";

import React from "react";
import Wordpress from "./Wordpress"; // Adjust the import path as necessary
import { useParams } from "next/navigation"; // Use next/navigation instead

const ParentComponent = () => {
  const params = useParams(); // Get dynamic parameters from the URL
  const website = Array.isArray(params.website) ? params.website[0] : params.website; // Ensure website is a string

  return (
    <>
    <Wordpress website={website || ''} />
    </>
  )
  
};

export default ParentComponent;
