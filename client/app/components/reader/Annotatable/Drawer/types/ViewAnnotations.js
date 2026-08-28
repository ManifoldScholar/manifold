import PropTypes from "prop-types";
import { useFetch, useAuthentication } from "hooks";
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

  const { authenticated, currentUser } = useAuthentication();
  const { trusted, established } = currentUser?.attributes ?? {};
  const showUnverifiedWarning = !!authenticated && !trusted && !established;

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
      showUnverifiedWarning={showUnverifiedWarning}
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
