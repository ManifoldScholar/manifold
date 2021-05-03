import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "./parts/Button";
import Panel from "./parts/Panel";
import ReadingGroupOption from "./parts/ReadingGroupOption";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";
import { ReaderContext } from "helpers/contexts";
import withCurrentUser from "hoc/with-current-user";

class AnnotationPopupSecondaryReadingGroup extends PureComponent {
  static displayName = "Annotation.Popup.Secondary.ReadingGroup";

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onBackClick: PropTypes.func.isRequired,
    direction: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    readingGroups: PropTypes.array,
    currentReadingGroup: PropTypes.string.isRequired
  };

  static contextType = ReaderContext;

  get publicLabel() {
    return "My Public Annotations";
  }

  get privateLabel() {
    return "My Private Annotations";
  }

  get readingGroups() {
    return this.props.readingGroups;
  }

  get canAccessReadingGroups() {
    const { currentUser } = this.props;
    if (!currentUser) return false;
    return currentUser.attributes.classAbilities.readingGroup.read;
  }

  get hasReadingGroups() {
    return this.readingGroups && this.readingGroups.length > 0;
  }

  get canEngagePublicly() {
    return this.context.attributes.abilities.engagePublicly;
  }

  isPrivateGroup(privacy) {
    return privacy === "private" || privacy === "anonymous";
  }

  renderBackButton() {
    return (
      <Button
        key="back"
        onClick={this.props.onBackClick}
        kind="any"
        label="Back"
        className="annotation-popup__button--secondary-dark"
        icon="arrowLeft32"
      />
    );
  }

  renderHeader() {
    return (
      <div className="annotation-popup__header">
        <IconComposer icon="readingGroup24" size="default" />
        <span className="annotation-popup__heading">
          {this.canAccessReadingGroups ? "Reading Groups:" : "Visibility"}
        </span>
      </div>
    );
  }

  renderOptions() {
    const { onSelect, currentReadingGroup } = this.props;
    return (
      <ul className="annotation-group-options__list">
        {this.canEngagePublicly && (
          <ReadingGroupOption
            label={this.publicLabel}
            onClick={() => onSelect("public")}
            selected={currentReadingGroup === "public"}
          />
        )}
        <ReadingGroupOption
          label={this.privateLabel}
          onClick={() => onSelect("private")}
          privateGroup
          selected={currentReadingGroup === "private"}
        />
        {this.hasReadingGroups &&
          this.readingGroups.map(rg => (
            <ReadingGroupOption
              key={rg.id}
              label={rg.attributes.name}
              onClick={() => onSelect(rg.id)}
              privateGroup={this.isPrivateGroup(rg.attributes.privacy)}
              selected={currentReadingGroup === rg.id}
            />
          ))}
      </ul>
    );
  }

  renderFooter() {
    if (!this.canAccessReadingGroups) return null;
    return (
      <div className="annotation-group-options__footer">
        <Link
          to={lh.link("frontendMyReadingGroups")}
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
    );
  }

  render() {
    return (
      <Panel
        visible={this.props.visible}
        direction={this.props.direction}
        name="readingGroups"
      >
        <>
          {this.renderHeader()}
          <div className="annotation-group-options annotation-group-options--dark">
            {this.renderOptions()}
            {this.renderFooter()}
          </div>
          {this.renderBackButton()}
        </>
      </Panel>
    );
  }
}

export default withCurrentUser(AnnotationPopupSecondaryReadingGroup);
