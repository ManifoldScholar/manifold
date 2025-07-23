import PropTypes from "prop-types";
import AnnotationEditor from "global/components/Annotation/Editor/index";
import AnnotationSelectionWrapper from "global/components/Annotation/Annotation/TextContent/index";

export default function NewAnnotation({ pendingAnnotation, actions }) {
  const saveAnnotation = annotation => {
    const attributes = {
      ...pendingAnnotation,
      ...annotation.attributes
    };
    const toCreate = { ...pendingAnnotation, attributes };
    return actions.createAnnotation(toCreate);
  };

  return (
    <div className="annotation-selection">
      <AnnotationSelectionWrapper
        selection={pendingAnnotation.subject}
        annotation={{ attributes: pendingAnnotation }}
      />
      <AnnotationEditor
        cancel={actions.closeDrawer}
        annotation={{ attributes: {} }}
        saveAnnotation={saveAnnotation}
      />
    </div>
  );
}

NewAnnotation.propTypes = {
  pendingAnnotation: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};
