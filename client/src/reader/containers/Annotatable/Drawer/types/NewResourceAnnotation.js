import PropTypes from "prop-types";
import AddResourceAnnotationForm from "reader/containers/resource-annotation/AddResourceAnnotationForm";

export default function NewResourceAnnotation({
  projectId,
  pendingAnnotation,
  actions,
  close
}) {
  return (
    <AddResourceAnnotationForm
      projectId={projectId}
      pendingAnnotation={pendingAnnotation}
      createAnnotation={actions.createAnnotation}
      closeDrawer={close}
    />
  );
}

NewResourceAnnotation.drawerProps = {
  context: "backend",
  size: "default",
  padding: "default"
};

NewResourceAnnotation.propTypes = {
  projectId: PropTypes.string,
  pendingAnnotation: PropTypes.object,
  actions: PropTypes.object,
  close: PropTypes.func
};
