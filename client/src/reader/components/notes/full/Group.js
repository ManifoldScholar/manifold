import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import GroupItem from "./GroupItem";

export default class Group extends PureComponent {
  static displayName = "Notes.Full.Group";

  static propTypes = {
    annotations: PropTypes.array,
    header: PropTypes.string,
    handleVisitAnnotation: PropTypes.func.isRequired
  };

  render() {
    if (!this.props.annotations) return null;
    return (
      <li className="selection-list separated">
        <div className="selection-group-heading">
          <h2>{this.props.header}</h2>
        </div>
        <ul>
          {this.props.annotations.map(annotation => {
            return (
              <GroupItem
                key={annotation.id}
                annotation={annotation}
                handleVisitAnnotation={this.props.handleVisitAnnotation}
              />
            );
          })}
        </ul>
      </li>
    );
  }
}
