import partition from "lodash/partition";
import ResourceBlock from "./Block";
import ResourceMarker from "./Marker";

export default function Factory({ annotations }) {
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
