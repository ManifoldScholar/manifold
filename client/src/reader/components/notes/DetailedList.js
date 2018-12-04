import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Full from "./full";
import EmptyMessage from "./EmptyMessage";

export default class DetailedList extends PureComponent {
  static displayName = "Notes.DetailedList";

  static propTypes = {
    sortedAnnotations: PropTypes.array,
    handleVisitAnnotation: PropTypes.func,
    handleUpdateAnnotation: PropTypes.func,
    handleDeleteAnnotation: PropTypes.func,
    annotated: PropTypes.bool,
    loaded: PropTypes.bool
  };

  static defaultProps = {
    annotations: []
  };

  render() {
    if (!this.props.loaded) return null;
    if (this.props.sortedAnnotations.length === 0)
      return <EmptyMessage annotated={this.props.annotated} />;
    return (
      <ul className="notes-list">
        {this.props.sortedAnnotations.map(group => {
          return (
            <Full.Group
              key={group.sectionId}
              annotations={group.annotations}
              header={group.name}
              handleVisitAnnotation={this.props.handleVisitAnnotation}
              handleUpdateAnnotation={this.props.handleUpdateAnnotation}
              handleDeleteAnnotation={this.props.handleDeleteAnnotation}
            />
          );
        })}
      </ul>
    );
  }
}
