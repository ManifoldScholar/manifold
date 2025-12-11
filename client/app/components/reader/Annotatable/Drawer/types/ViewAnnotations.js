import PropTypes from "prop-types";
import { useFetch } from "hooks";
import { annotationsAPI } from "api";
import Annotation from "components/global/Annotation";

export default function ViewAnnotations({
  actions,
  sectionId,
  textId,
  annotationIds,
  close: closeDrawer
}) {
  const { data: annotations } = useFetch(
    () => annotationsAPI.forSection(sectionId, textId, { ids: annotationIds }),
    [sectionId, textId, annotationIds]
  );

  const saveAnnotation = (model, group) => {
    const attributes = { ...group.selection, ...model.attributes };
    const newModel = { ...model, attributes };
    return actions.createAnnotation(newModel);
  };

  return (
    <Annotation.List.GroupedBySelection
      saveAnnotation={saveAnnotation}
      annotations={annotations ?? []}
      loginHandler={actions.showLogin}
      focusHandler={actions.focusHandler}
      closeDrawer={closeDrawer}
    />
  );
}

ViewAnnotations.drawerProps = {
  icon: "comment32",
  title: "glossary.annotation_title_case_other"
};

ViewAnnotations.propTypes = {
  annotationIds: PropTypes.array.isRequired,
  sectionId: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
  textId: PropTypes.string.isRequired
};
