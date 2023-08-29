import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import List from "../../List";

export default class ViewAnnotations extends PureComponent {
  static drawerProps = () => {
    return {
      icon: "comment32",
      title: { key: "glossary.annotation_title_case_other" } // Passing the translation key to the drawer wrapper (client/src/global/components/drawer/Wrapper.js), temporary fix until this component can undergo a refacter
    };
  };

  static propTypes = {
    annotationIds: PropTypes.array.isRequired,
    sectionId: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired,
    textId: PropTypes.string.isRequired
  };

  render() {
    const { actions } = this.props;
    return (
      <List
        closeDrawer={actions.closeDrawer}
        sectionId={this.props.sectionId}
        textId={this.props.textId}
        annotationIds={this.props.annotationIds}
        createHandler={actions.createAnnotation}
        loginHandler={actions.showLogin}
      />
    );
  }
}
