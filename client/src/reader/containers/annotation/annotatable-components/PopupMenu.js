import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Popup from "reader/components/annotation/Popup";

import withReadingGroups from "hoc/with-reading-groups";

class AnnotatablePopup extends PureComponent {
  static displayName = "Annotation.Popup.Menu";

  static propTypes = {
    activeEvent: PropTypes.object,
    direction: PropTypes.string,
    actions: PropTypes.object.isRequired,
    text: PropTypes.object.isRequired,
    section: PropTypes.object,
    activeAnnotation: PropTypes.object,
    selection: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.tabRef = React.createRef();
    this.state = {
      activePanel: "primary"
    };
  }

  // TODO: The below focus event works well on Chrome,
  // in that it keeps the current highlight while allowing tabbing within the popup
  // but on FF and Safari, the highlight is lost (and on FF no popup even appears so, unacceptable)
  // componentDidMount() {
  //   this.setFocus();
  // }

  // setFocus = () => {
  //   this.tabRef.current.focus();
  // };

  closeSecondary = () => {
    this.setState({ activePanel: "primary" });
  };

  openSecondary = () => {
    this.setState({ activePanel: "secondary" });
  };

  openReadingGroups = () => {
    this.setState({ activePanel: "readingGroups" });
  };

  handleReadingGroupSelect = id => {
    if (id !== this.props.currentAnnotatingReadingGroup) {
      this.props.setAnnotatingReadingGroup(id);
    }
    this.closeSecondary();
  };

  showLinkMenu() {
    const { activeEvent } = this.props;
    if (!activeEvent) return false;
    return activeEvent.annotationIds && activeEvent.link;
  }

  renderLinkMenu() {
    return (
      <Popup.Link
        direction={this.props.direction}
        showAnnotationsInDrawer={this.props.actions.openViewAnnotationsDrawer}
        annotations={this.props.activeEvent.annotationIds}
        selectedLink={this.props.activeEvent.link}
      />
    );
  }

  render() {
    if (this.showLinkMenu()) return this.renderLinkMenu();

    const { activePanel } = this.state;

    return (
      <div
        className="annotation-popup__panel--secondary-group"
        ref={this.tabRef}
        tabIndex={0}
        onFocus={e => e.stopPropagation()}
      >
        {activePanel === "primary" && (
          <Popup.Annotate
            primary
            direction={this.props.direction}
            visible
            actions={this.props.actions}
            showShare={this.openSecondary}
            showReadingGroups={this.openReadingGroups}
            activeAnnotation={this.props.activeAnnotation}
            text={this.props.text}
            readingGroups={this.props.readingGroups}
            currentReadingGroup={this.props.currentAnnotatingReadingGroup}
          />
        )}
        {activePanel === "secondary" && (
          <Popup.Share
            visible
            direction={this.props.direction}
            onBackClick={this.closeSecondary}
            onCiteClick={this.props.actions.openCitationDrawer}
            selection={this.props.selection}
            text={this.props.text}
            section={this.props.section}
          />
        )}
        {activePanel === "readingGroups" && (
          <Popup.ReadingGroups
            visible
            direction={this.props.direction}
            onBackClick={this.closeSecondary}
            onSelect={this.handleReadingGroupSelect}
            readingGroups={this.props.readingGroups}
            currentReadingGroup={this.props.currentAnnotatingReadingGroup}
          />
        )}
      </div>
    );
  }
}

export default withReadingGroups(AnnotatablePopup);
