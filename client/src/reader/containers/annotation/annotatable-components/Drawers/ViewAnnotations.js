import PropTypes from "prop-types";
import List from "../../List";

export default function ViewAnnotations({
  actions,
  sectionId,
  textId,
  annotationIds
}) {
  return (
    <List
      closeDrawer={actions.closeDrawer}
      sectionId={sectionId}
      textId={textId}
      annotationIds={annotationIds}
      createHandler={actions.createAnnotation}
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
