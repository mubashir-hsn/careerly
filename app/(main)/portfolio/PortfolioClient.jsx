"use client";

import React, { useState } from "react";
import AIGenerator from "./_components/AIGenerator";
import PortfolioForm from "./_components/PortfolioForm";

const PortfolioClient = ({ initialPortfolio, hasResume, defaultUser }) => {
  const [extractedData, setExtractedData] = useState(initialPortfolio);

  if (extractedData) {
    return (
      <div className="py-5">
        <PortfolioForm initialData={extractedData} defaultUser={defaultUser} />
      </div>
    );
  }

  // If no portfolio yet, show the AI onboarding screen
  return (
    <div className="py-5">
      <AIGenerator
        onGenerate={(data) => setExtractedData(data)}
        onStartScratch={() => setExtractedData({})}
        hasResume={hasResume}
      />
    </div>
  );
};

export default PortfolioClient;
