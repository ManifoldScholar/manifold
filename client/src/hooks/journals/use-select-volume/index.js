import { useSelector } from "react";
import { fixtures } from "helpers/storybook/exports";

// Redo this hook (or don't use if all volume data is contained in the journal) with api
export default function useSelectVolume(journal, slug) {
  const volume = journal
    ? journal.relationships.volumes.filter(
        item => item.attributes.slug === slug
      )[0]
    : null;
  return { volume };
}
