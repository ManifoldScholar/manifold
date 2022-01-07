import { useState } from "react";
import { fixtures } from "helpers/storybook/exports";

// Mock data until we have the api
const sampleData = fixtures.collectionFactory("journal", 1);

export default function useSelectJournal() {
  const journal = sampleData[0];
  console.log(journal);
  console.log(sampleData);
  const issuesMeta = {
    pagination: { totalCount: 12, perPage: 12, currentPage: 1 }
  };
  const issues = {};
  return { journal, issuesMeta, issues };
}
