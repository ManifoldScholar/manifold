import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import Authorize from "hoc/authorize";

export default class CurrentReadingGroup extends PureComponent {
  static displayName = "Annotation.Popup.CurrentReadingGroup";

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    readingGroups: PropTypes.array,
    currentReadingGroup: PropTypes.string,
    canAccessReadingGroups: PropTypes.bool,
    canEngagePublicly: PropTypes.bool
  };

  static defaultProps = {
    currentReadingGroup: "public",
    canAccessReadingGroups: false,
    canEngagePublicly: false
  };

  get canAccessReadingGroups() {
    return this.props.canAccessReadingGroups;
  }

  get canEngagePublicly() {
    return this.props.canEngagePublicly;
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
      <Authorize kind="any">
        <button
          onClick={onClick}
          className="annotation-popup__button annotation-popup__button--stacked annotation-popup__button--secondary-dark"
        >
          <span className="annotation-popup__button-text">
            {this.canAccessReadingGroups
              ? "Current Group:"
              : "Current Visibility:"}
          </span>
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
      </Authorize>
    );
  }
}
