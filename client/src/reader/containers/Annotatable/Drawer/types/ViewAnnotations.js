import { useMemo } from "react";
import PropTypes from "prop-types";
import { useFetch } from "hooks";
import { annotationsAPI, requests } from "api";
import Annotation from "global/components/Annotation";

export default function ViewAnnotations({
  actions,
  sectionId,
  textId,
  annotationIds
}) {
  const request = useMemo(
    () => [
      annotationsAPI.forSection,
      sectionId,
      textId,
      { ids: annotationIds }
    ],
    [textId, sectionId, annotationIds]
  );

  const { data: annotations } = useFetch({
    request,
    options: { requestKey: requests.rDrawerAnnotations }
  });

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
