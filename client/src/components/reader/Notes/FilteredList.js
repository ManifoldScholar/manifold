import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Notes } from "components/reader";

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
    annotations: []
  };

  renderHeading() {
    return (
      <div className="drawer-bar">
        <h2 className="drawer-title" onClick={this.props.handleSeeAllClick}>
          Your Notes
        </h2>
        {this.props.sortedAnnotations.length > 0
          ? <button
              onClick={this.props.handleSeeAllClick}
              className="button-primary"
            >
              See all
            </button>
          : null}
      </div>
    );
  }

  renderList() {
    if (this.props.sortedAnnotations.length === 0) {
      return <Notes.EmptyMessage annotated={this.props.annotated} />;
    }
    return (
      <ul>
        {this.props.sortedAnnotations.map(group => {
          return (
            <Notes.Partial.Group
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
      <div>
        {this.renderHeading()}
        <Notes.Partial.Filters
          filterChangeHandler={this.props.handleFilterChange}
          filter={this.props.filter}
        />
        <nav>
          {this.props.loaded ?
          this.renderList()
          : null }
        </nav>
      </div>
    );
  }
}
