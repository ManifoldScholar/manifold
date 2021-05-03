import React, { PureComponent } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";
import ReadingGroupOption from "reader/components/annotation/Popup/parts/ReadingGroupOption";
import { ReaderContext } from "helpers/contexts";
import lh from "helpers/linkHandler";

class GroupPickerOptions extends PureComponent {
  static displayName = "Annotation.GroupPickerOptions";

  static propTypes = {
    setReadingGroup: PropTypes.func.isRequired,
    currentReadingGroup: PropTypes.string,
    readingGroups: PropTypes.array.isRequired,
    pickerOpen: PropTypes.bool.isRequired,
    currentUser: PropTypes.object
  };

  static defaultProps = {};

  static contextType = ReaderContext;

  get readingGroups() {
    return this.props.readingGroups;
  }

  get canEngagePublicly() {
    return this.context.attributes.abilities.engagePublicly;
  }

  get hasReadingGroups() {
    return this.readingGroups && this.readingGroups.length > 0;
  }

  get publicLabel() {
    return "My Public Annotations";
  }

  get privateLabel() {
    return "My Private Annotations";
  }

  get canAccessReadingGroups() {
    const { currentUser } = this.props;
    if (!currentUser) return false;
    return currentUser.attributes.classAbilities.readingGroup.read;
  }

  isPrivateGroup(privacy) {
    return privacy === "private" || privacy === "anonymous";
  }

  isSelected(option) {
    if (option === this.props.currentReadingGroup) return true;
    return false;
  }

  setReadingGroup = rgId => {
    if (!this.picker) return;
    this.props.setReadingGroup(rgId);
  };

  render() {
    return (
      <div
        ref={picker => (this.picker = picker)}
        tabIndex="-1"
        className={classNames({
          "annotation-group-options": true,
          "annotation-group-options--popup": true,
          "annotation-group-options--light": true,
          "annotation-group-options--hidden": !this.props.pickerOpen
        })}
      >
        <ul className="annotation-group-options__list">
          {this.canEngagePublicly && (
            <ReadingGroupOption
              label={this.publicLabel}
              onClick={() => this.setReadingGroup("public")}
              selected={this.isSelected("public")}
            />
          )}
          <ReadingGroupOption
            label={this.privateLabel}
            onClick={() => this.setReadingGroup("private")}
            privateGroup
            selected={this.isSelected("private")}
          />
          {this.hasReadingGroups &&
            this.readingGroups.map(rg => (
              <ReadingGroupOption
                key={rg.id}
                label={rg.attributes.name}
                onClick={() => this.setReadingGroup(rg.id)}
                privateGroup={this.isPrivateGroup(rg.attributes.privacy)}
                selected={this.isSelected(rg.id)}
              />
            ))}
        </ul>
        {this.canAccessReadingGroups && (
          <div className="annotation-group-options__footer">
            <Link
              to={lh.link("frontendReadingGroups")}
              className="annotation-group-options__link"
            >
              <span className="annotation-group-options__link-text">
                Manage Groups
              </span>
              <IconComposer
                icon="link24"
                size="default"
                iconClass="annotation-group-options__icon annotation-group-options__icon--link"
              />
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export default GroupPickerOptions;
