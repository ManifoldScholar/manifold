import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Button from "./parts/Button";
import Panel from "./parts/Panel";
import CurrentReadingGroup from "./parts/CurrentReadingGroup";
import classNames from "classnames";
import withCurrentUser from "hoc/with-current-user";
import { ReaderContext } from "helpers/contexts";

class AnnotationPopupAnnotate extends PureComponent {
  static displayName = "Annotation.Popup.Annotate";

  static propTypes = {
    actions: PropTypes.object.isRequired,
    showShare: PropTypes.func.isRequired,
    showReadingGroups: PropTypes.func,
    text: PropTypes.object.isRequired,
    activeAnnotation: PropTypes.object,
    direction: PropTypes.string.isRequired,
    primary: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired,
    readingGroups: PropTypes.array,
    currentReadingGroup: PropTypes.string
  };

  static defaultProps = {
    primary: true,
    visible: true,
    direction: "down"
  };

  static contextType = ReaderContext;

  get actions() {
    return this.props.actions;
  }

  get canEngagePublicly() {
    return this.context.attributes.abilities.engagePublicly;
  }

  get canAccessReadingGroups() {
    const { currentUser } = this.props;
    if (!currentUser) return false;
    return currentUser.attributes.classAbilities.readingGroup.read;
  }

  get hasActiveAnnotation() {
    const selected = this.props.activeAnnotation;
    if (!selected) return false;
    return (
      selected.attributes.abilities.delete &&
      selected.attributes.format === "highlight"
    );
  }

  rowHighlighted(direction) {
    if (!this.hasActiveAnnotation) return null;
    const isCreator = this.props.activeAnnotation.attributes
      .currentUserIsCreator;
    const label = isCreator ? "You Highlighted" : "A Reader Highlighted";
    const className = classNames({
      "annotation-popup__note": true,
      "annotation-popup__note--top": direction === "up",
      "annotation-popup__note--bottom": direction === "down"
    });
    return (
      <div key="notice" className={className}>
        {label}
      </div>
    );
  }

  rowHighlight() {
    const highlighted = this.hasActiveAnnotation;
    const className = classNames({
      "annotation-popup__button--selected": highlighted
    });
    const onClick = highlighted
      ? () => this.actions.destroyAnnotation(this.props.activeAnnotation)
      : this.actions.createHighlight;
    return (
      <Button
        key={"highlight"}
        className={className}
        onClick={onClick}
        kind="any"
        label="Highlight"
        icon="annotate24"
      />
    );
  }

  rowAnnotate() {
    return (
      <Button
        key={"annotate"}
        onClick={this.actions.openNewAnnotationDrawer}
        onTouchStart={this.actions.openNewAnnotationDrawer}
        kind="any"
        label="Annotate"
        icon="comment24"
      />
    );
  }

  rowNotate() {
    return (
      <Button
        key={"notate"}
        onClick={this.actions.openNewNotationDrawer}
        ability="notate"
        entity={this.props.text}
        label="Resource"
        icon="resource24"
      />
    );
  }

  rowShare() {
    return (
      <Button
        key={"share"}
        onClick={this.props.showShare}
        kind="any"
        label="Share"
        icon="share24"
      />
    );
  }

  rowLogin() {
    return (
      <Button
        key={"login"}
        onClick={this.actions.showLogin}
        kind="unauthenticated"
        label="Login to Annotate"
        icon="editProfile24"
      />
    );
  }

  rowCurrentReadingGroup() {
    if (!this.canAccessReadingGroups && !this.canEngagePublicly) return null;
    return (
      <CurrentReadingGroup
        key="reading-groups"
        onClick={this.props.showReadingGroups}
        readingGroups={this.props.readingGroups}
        currentReadingGroup={this.props.currentReadingGroup}
        canAccessReadingGroups={this.canAccessReadingGroups}
        canEngagePublicly={this.canEngagePublicly}
      />
    );
  }

  rows(direction = "up") {
    const rows = [];
    rows.push(this.rowHighlighted(direction));
    rows.push(this.rowHighlight());
    rows.push(this.rowAnnotate());
    rows.push(this.rowNotate());
    rows.push(this.rowShare());
    rows.push(this.rowLogin());
    if (direction === "down") {
      rows.reverse();
      rows.push(this.rowCurrentReadingGroup());
      return rows;
    }
    rows.push(this.rowCurrentReadingGroup());
    return rows;
  }

  render() {
    return (
      <Panel
        primary={this.props.primary}
        visible={this.props.visible}
        direction={this.props.direction}
      >
        {this.rows(this.props.direction)}
      </Panel>
    );
  }
}

export default withCurrentUser(AnnotationPopupAnnotate);
