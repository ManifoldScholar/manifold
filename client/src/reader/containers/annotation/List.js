import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { annotationsAPI } from "api";
import Annotation from "global/components/Annotation";
import { useFetch, useFromStore } from "hooks";

export default function AnnotationList({
  annotationIds,
  createHandler,
  loginHandler,
  focusHandler,
  closeDrawer,
  sectionId,
  textId
}) {
  const dispatch = useDispatch();

  const { data: annotations = [] } = useFetch({
    request: [
      annotationsAPI.forSection,
      sectionId,
      textId,
      { ids: annotationIds }
    ],
    condition: !!sectionId && !!textId && annotationIds?.length > 0
  });

  const authentication = useFromStore({ path: "authentication" });

  useEffect(() => {
    if (annotations.length === 0 && closeDrawer) {
      closeDrawer();
    }
  }, [annotations.length, closeDrawer]);

  const saveAnnotation = (model, group) => {
    const attributes = { ...group.selection, ...model.attributes };
    const newModel = { ...model, attributes };
    return createHandler(newModel);
  };

  const showUnverifiedWarning = () => {
    if (!authentication?.authenticated) return false;
    const { currentUser } = authentication;
    const { trusted, established } = currentUser.attributes;
    return !trusted && !established;
  };

  return (
    <Annotation.List.GroupedBySelection
      saveAnnotation={saveAnnotation}
      annotations={annotations}
      loginHandler={loginHandler}
      focusHandler={focusHandler}
      dispatch={dispatch}
      showUnverifiedWarning={showUnverifiedWarning()}
    />
  );
}

AnnotationList.displayName = "Annotation.List";

AnnotationList.propTypes = {
  loginHandler: PropTypes.func.isRequired,
  annotationIds: PropTypes.array.isRequired,
  createHandler: PropTypes.func.isRequired,
  focusHandler: PropTypes.func,
  closeDrawer: PropTypes.func,
  sectionId: PropTypes.string,
  textId: PropTypes.string
};
