import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import Menu from "reader/components/annotation/Popup/Menu";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";

export default class AnnotatablePopup extends PureComponent {
  static displayName = "Annotation.Popup.Menu";

  static propTypes = {
    activeEvent: PropTypes.object,
    direction: PropTypes.string,
    actions: PropTypes.object.isRequired,
    text: PropTypes.object,
    section: PropTypes.object,
    activeAnnotation: PropTypes.object,
    selection: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      contents: "annotation",
      activePanel: "primary"
    };
  }

  closeSecondary = () => {
    this.setState({ activePanel: "primary" });
  };

  openSecondary = () => {
    this.setState({ activePanel: "secondary" });
  };

  showLinkMenu() {
    const { activeEvent } = this.props;
    if (!activeEvent) return false;
    return activeEvent.annotationIds && activeEvent.link;
  }

  renderLinkMenu() {
    return (
      <Menu.Link
        direction={this.props.direction}
        showAnnotationsInDrawer={this.props.actions.openViewAnnotationsDrawer}
        annotations={this.props.activeEvent.annotationIds}
        selectedLink={this.props.activeEvent.link}
      />
    );
  }

  render() {
    if (this.showLinkMenu()) return this.renderLinkMenu();

    return (
      <Fragment>
        <Menu.Annotate
          primary
          direction={this.props.direction}
          visible={this.state.activePanel === "primary"}
          actions={this.props.actions}
          showShare={this.openSecondary}
          activeAnnotation={this.props.activeAnnotation}
          text={this.props.text}
        />
        <ReactCSSTransitionGroup
          transitionName="page"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
          component="div"
          className="popup-page-secondary-group"
        >
          {this.state.activePanel === "secondary" ? (
            <Menu.Share
              visible
              direction={this.props.direction}
              onBackClick={this.closeSecondary}
              onCiteClick={this.props.actions.openCitationDrawer}
              selection={this.props.selection}
              text={this.props.text}
              section={this.props.section}
            />
          ) : null}
        </ReactCSSTransitionGroup>
      </Fragment>
    );
  }
}
