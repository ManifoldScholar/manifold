import Header from "./Header";
import { useFromStore } from "hooks";
import { useParams } from "react-router-dom";
import ResourcePreview from "frontend/components/resource/Preview";
import * as Styled from "./styles";
import { useId } from "react";

export default function ResourceAnnotationDialog({ resource, ...dialog }) {
  const headingId = useId();

  const { sectionId } = useParams();
  const section = useFromStore({
    path: `entityStore.entities.textSections.${sectionId}`
  });

  const resourceEntity = useFromStore({
    path: `entityStore.entities.${resource.type}s.${resource.id}`
  });

  return (
    <Styled.Dialog
      ref={dialog.dialogRef}
      inert={!dialog.open ? "" : undefined}
      aria-labelledby={headingId}
    >
      <Header
        onClose={dialog.onCloseClick}
        title={resourceEntity?.attributes.title}
        headingId={headingId}
      />
      <div className="container-inline-size">
        <Styled.Inner>
          {resourceEntity ? (
            <ResourcePreview
              resource={resourceEntity}
              // resourceCollection={collection}
            />
          ) : null}
        </Styled.Inner>
      </div>
    </Styled.Dialog>
  );
}
