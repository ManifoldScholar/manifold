import { useSelector } from "react";
import { fixtures } from "helpers/storybook/exports";

// Redo this hook (or don't use if all volume data is contained in the journal) with api
export default function useSelectVolume(match, journal) {
  if (!journal) return { volume: null, volumeResponse: null };

  const volume = journal.relationships.volumes.find(
    v => v.id === match.params.volumeSlug
  );
  return { volume, volumeResponse: volume };
}
