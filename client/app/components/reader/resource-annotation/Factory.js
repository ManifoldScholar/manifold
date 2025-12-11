import { partition } from "lodash-es";
import { useLoaderEntity } from "hooks";
import ResourceBlock from "./Block";
import ResourceMarker from "./Marker";
import StaticMarker from "./Marker/Static";

export default function Factory({ annotations }) {
  const text = useLoaderEntity("texts");

  if (!text)
    return annotations.map(annotation => (
      <StaticMarker key={annotation.id} annotation={annotation} />
    ));

  const [blocks, markers] = partition(
    annotations,
    a => a.readerDisplayFormat === "block" || a.readerDisplayFormat === "embed"
  );

  return (
    <>
      {markers.map(annotation => (
        <ResourceMarker key={annotation.id} annotation={annotation} />
      ))}
      {blocks.map(annotation => (
        <ResourceBlock key={annotation.id} annotation={annotation} />
      ))}
    </>
  );
}
