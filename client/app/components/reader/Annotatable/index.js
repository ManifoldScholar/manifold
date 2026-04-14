import { useLocation, useNavigate, useRevalidator } from "react-router";
import { annotationsAPI } from "api";
import { useApiCallback, useReadingGroups } from "hooks";
import useDialog from "@castiron/hooks/useDialog";
import AnnotatableBase from "./Annotatable";

export default function AnnotatableWrapper({ text, section, ...rest }) {
  const createAnnotationApi = useApiCallback(annotationsAPI.create);
  const destroyAnnotationApi = useApiCallback(annotationsAPI.destroy);
  const { revalidate } = useRevalidator();

  const location = useLocation();
  const navigate = useNavigate();
  const { currentAnnotatingReadingGroup } = useReadingGroups();

  const resourceDisplayFormatDialog = useDialog({
    modal: true,
    scrollLockClassName: "no-scroll"
  });

  return (
    <AnnotatableBase
      {...rest}
      text={text}
      section={section}
      projectId={text.relationships.project.id}
      textId={text.id}
      sectionId={section.id}
      location={location}
      navigate={navigate}
      currentAnnotatingReadingGroup={currentAnnotatingReadingGroup}
      resourceDisplayFormatDialog={resourceDisplayFormatDialog}
      createAnnotationApi={createAnnotationApi}
      destroyAnnotationApi={destroyAnnotationApi}
      revalidate={revalidate}
    />
  );
}
