import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Button from "../Button";
import Panel from "../Panel";
import classNames from "classnames";

export default class AnnotationPopupAnnotate extends PureComponent {
  static displayName = "Annotation.Popup.Annotate";

  static propTypes = {
    actions: PropTypes.object.isRequired,
    showShare: PropTypes.func.isRequired,
    text: PropTypes.object.isRequired,
    activeAnnotation: PropTypes.object,
    direction: PropTypes.string.isRequired,
    primary: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired
  };

  static defaultProps = {
    primary: true,
    visible: true,
    direction: "down"
  };

  get actions() {
    return this.props.actions;
  }

  get hasActiveAnnotation() {
    const selected = this.props.activeAnnotation;
    if (!selected) return false;
    return (
      selected.attributes.abilities.delete &&
      selected.attributes.format === "highlight"
    );
  }

  rowHighlighted() {
    if (!this.hasActiveAnnotation) return null;
    const isCreator = this.props.activeAnnotation.attributes
      .currentUserIsCreator;
    const label = isCreator ? "You Highlighted" : "A Reader Highlighted";
    return (
      <div key="notice" className="note">
        {label}
      </div>
    );
  }

  rowHighlight() {
    const highlighted = this.hasActiveAnnotation;
    const className = classNames({ selected: highlighted });
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
        iconClass="manicon-pencil-simple"
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
        iconClass="manicon-word-bubble"
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
        iconClass="manicon-cube-outline"
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
        iconClass="manicon-nodes"
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
        iconClass="manicon-person-pencil"
      />
    );
  }

  rows(direction = "up") {
    const rows = [];
    rows.push(this.rowHighlighted());
    rows.push(this.rowHighlight());
    rows.push(this.rowAnnotate());
    rows.push(this.rowNotate());
    rows.push(this.rowShare());
    rows.push(this.rowLogin());
    if (direction === "down") return rows.reverse();
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
