import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Annotation from "global/components/Annotation";
import EmptyMessage from "./EmptyMessage";

export default class DetailedList extends PureComponent {
  static displayName = "Notes.DetailedList";

  static propTypes = {
    sortedAnnotations: PropTypes.array,
    handleVisitAnnotation: PropTypes.func,
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
      <Annotation.List.GroupedBySection
        handleVisitAnnotation={this.props.handleVisitAnnotation}
        groupedAnnotations={this.props.sortedAnnotations}
      />
    );
  }
}
