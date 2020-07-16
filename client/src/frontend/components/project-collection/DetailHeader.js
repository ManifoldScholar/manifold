import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import DetailHeaderImage from "./DetailHeaderImage";

export default class ProjectCollectionDetailHeader extends PureComponent {
  static displayName = "ProjectCollectionDetailHeader";

  get iconFill() {
    if (this.props.icon === "new-round") {
      return "var(--accent-primary, #52e3ac)";
    }

    return "currentColor";
  }

  render() {
    return (
      <div className="section-heading entity-section-wrapper__heading">
        <div className="main">
          <DetailHeaderImage attributes={this.props} />
          <div className="body">
            <h2 className="title">{this.props.title}</h2>
          </div>
        </div>
      </div>
    )
  }
}
