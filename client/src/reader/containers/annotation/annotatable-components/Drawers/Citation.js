import PropTypes from "prop-types";
import Annotation from "reader/components/annotation";

export default function Citation({ closeDrawer, annotation, section }) {
  return (
    <Annotation.Share.Wrapper
      closeDrawer={closeDrawer}
      annotation={annotation}
      section={section}
      truncate={600}
    />
  );
}

Citation.drawerProps = {
  icon: "share24",
  title: "actions.share"
};

Citation.propTypes = {
  closeDrawer: PropTypes.func,
  annotation: PropTypes.object,
  section: PropTypes.object.isRequired
};
