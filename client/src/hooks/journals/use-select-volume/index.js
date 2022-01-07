import { useState } from "react";
import { fixtures } from "helpers/storybook/exports";
import shuffle from "lodash/shuffle";

// Mock data until we have the api
const issues = fixtures
  .collectionFactory("issue", 4)
  .map(issue => issue.data)
  .map(issue => {
    const color = shuffle(["primary", "secondary", "tertiary", "quinary"])[0];
    return {
      ...issue,
      attributes: { ...issue.attributes, avatarColor: color }
    };
  });
const sampleData = fixtures.collectionFactory("volume", 1);

export default function useSelectVolume() {
  const volume = sampleData;
  const volumeMeta = {
    pagination: { totalCount: 12, perPage: 12, currentPage: 1 }
  };
  // const issues = volume.relationships.issues
  return { volume, volumeMeta, issues };
}
