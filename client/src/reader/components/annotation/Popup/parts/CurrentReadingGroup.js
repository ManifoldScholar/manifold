import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

export default class CurrentReadingGroup extends PureComponent {
  static displayName = "Annotation.Popup.CurrentReadingGroup";

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    readingGroups: PropTypes.array,
    currentReadingGroup: PropTypes.string
  };

  static defaultProps = {
    currentReadingGroup: "public"
  }

  get currentGroupName() {
    if (this.props.currentReadingGroup === "public")
      return "My Public Annotations";
    if (this.props.currentReadingGroup === "private")
      return "My Private Annotations";

    const currentGroup = this.props.readingGroups.find(
      group => group.id === this.props.currentReadingGroup
    );
    return currentGroup.attributes.name;
  }

  render() {
    const { onClick } = this.props;

    return (
      <button
        onClick={onClick}
        className="annotation-popup__button annotation-popup__button--stacked annotation-popup__button--secondary-dark"
      >
        <span className="annotation-popup__button-text">Current Group:</span>
        <div className="annotation-popup__button-inner-row">
          <span className="annotation-popup__button-text annotation-popup__button-text--small">
            {this.currentGroupName}
          </span>
          <IconComposer
            icon="disclosureUp16"
            size={22}
            iconClass="annotation-popup__button-icon annotation-popup__button-icon--disclosure"
          />
        </div>
      </button>
    );
  }
}
