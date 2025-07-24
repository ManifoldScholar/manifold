import partition from "lodash/partition";
import ResourceBlock from "./Block";
import ResourceMarkers from "./Marker";

export default function Factory({ annotations }) {
  const [blocks, markers] = partition(
    annotations,
    a => a.readerDisplayFormat === "block"
  );
  return (
    <>
      <ResourceMarkers annotations={markers} />
      {blocks.map(annotation => (
        <ResourceBlock annotation={annotation} />
      ))}
    </>
  );
}
