import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import Partial from "./partial";
import EmptyMessage from "./EmptyMessage";

export default class FilteredList extends PureComponent {
  static displayName = "Notes.FilteredList";

  static propTypes = {
    section: PropTypes.object,
    sortedAnnotations: PropTypes.array,
    handleSeeAllClick: PropTypes.func,
    handleFilterChange: PropTypes.func,
    handleVisitAnnotation: PropTypes.func,
    currentSectionId: PropTypes.string,
    filter: PropTypes.object,
    annotated: PropTypes.bool,
    loaded: PropTypes.bool
  };

  static defaultProps = {
    annotated: false,
    loaded: false
  };

  static defaultProps = {
    annotations: []
  };

  get hasAnnotations() {
    return this.props.sortedAnnotations.length > 0;
  }

  renderHeading() {
    const { handleSeeAllClick, handleFilterChange, filter } = this.props;
    return (
      <div className="notes-filtered-list__header">
        <Partial.Filters
          filterChangeHandler={handleFilterChange}
          filter={filter}
        />
        <button
          onClick={handleSeeAllClick}
          className="notes-filtered-list__see-all button-primary"
        >
          <span className="button-primary__text">See all</span>
          <IconComposer
            icon="link24"
            size="default"
            iconClass="button-primary__icon"
          />
        </button>
      </div>
    );
  }

  renderList() {
    if (!this.hasAnnotations) {
      return <EmptyMessage annotated={this.props.annotated} />;
    }
    return (
      <ul className="notes-filtered-list__section-list">
        {this.props.sortedAnnotations.map(group => {
          return (
            <Partial.Group
              key={group.sectionId}
              annotations={group.annotations}
              sectionName={group.name}
              readerSection={this.props.section}
              visitHandler={this.props.handleVisitAnnotation}
            />
          );
        })}
      </ul>
    );
  }

  render() {
    return (
      <div className="notes-filtered-list">
        {this.renderHeading()}
        <div>{this.props.loaded ? this.renderList() : null}</div>
      </div>
    );
  }
}
