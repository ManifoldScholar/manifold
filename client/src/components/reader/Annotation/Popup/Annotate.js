import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import HigherOrder from "containers/global/HigherOrder";
import Button from "./Button";
import Panel from "./Panel";
import classNames from "classnames";

class AnnotationPopupAnnotate extends PureComponent {
  static displayName = "Annotation.Popup.Annotate";

  static propTypes = {
    selectedAnnotation: PropTypes.object,
    showAnnotationsInDrawer: PropTypes.func,
    attachNotation: PropTypes.func.isRequired,
    destroySelected: PropTypes.func.isRequired,
    highlight: PropTypes.func.isRequired,
    annotate: PropTypes.func.isRequired,
    // bookmark: PropTypes.func.isRequired,
    showShare: PropTypes.func.isRequired,
    secondary: PropTypes.string,
    direction: PropTypes.string,
    showLogin: PropTypes.func.isRequired
  };

  highlightSelected() {
    const selected = this.props.selectedAnnotation;
    if (!selected) return false;
    return (
      selected.attributes.currentUserIsCreator &&
      selected.attributes.format === "highlight"
    );
  }

  rowHighlighted() {
    if (!this.highlightSelected()) return null;
    return (
      <div key="notice" className="note">
        {"You Highlighted"}
      </div>
    );
  }

  rowHighlight() {
    const highlighted = this.highlightSelected();
    const className = classNames({ selected: highlighted });
    const onClick = highlighted
      ? this.props.destroySelected
      : this.props.highlight;
    return (
      <Button
        key={"highlight"}
        className={className}
        onClick={onClick}
        requiredRole="any"
        label="Highlight"
        iconClass="manicon-pencil-simple"
      />
    );
  }

  rowAnnotate() {
    return (
      <Button
        key={"annotate"}
        onClick={this.props.annotate}
        requiredRole="any"
        label="Annotate"
        iconClass="manicon-word-bubble"
      />
    );
  }

  rowNotate() {
    return (
      <Button
        key={"notate"}
        onClick={this.props.attachNotation}
        requiredRole="admin"
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
        requiredRole="any"
        label="Share"
        iconClass="manicon-nodes"
      />
    );
  }

  rowLogin() {
    return (
      <Button
        key={"login"}
        onClick={this.props.showLogin}
        requiredRole="none"
        label="Login to Annotate"
        iconClass="manicon-person-pencil"
      />
    );
  }

  rowAnnotations() {
    if (!this.props.showAnnotationsInDrawer) return null;
    return (
      <Button
        key={"login"}
        onClick={this.props.showAnnotationsInDrawer}
        label="View Annotations"
        iconClass="manicon-word-bubble"
      />
    );
  }

  rows(direction = "up") {
    const rows = [];
    rows.push(this.rowHighlighted());
    rows.push(this.rowHighlight());
    rows.push(this.rowAnnotations());
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
        primary
        secondary={this.props.secondary}
        direction={this.props.direction}
      >
        {this.rows(this.props.direction)}
      </Panel>
    );
  }
}

export default HigherOrder.withCurrentUser(AnnotationPopupAnnotate);
