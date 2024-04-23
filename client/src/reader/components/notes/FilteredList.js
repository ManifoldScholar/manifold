import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";
import Partial from "./partial";
import EmptyMessage from "./EmptyMessage";
import { withTranslation } from "react-i18next";

class FilteredList extends PureComponent {
  static displayName = "Notes.FilteredList";

  static propTypes = {
    section: PropTypes.object,
    sortedAnnotations: PropTypes.array,
    handleSeeAllClick: PropTypes.func,
    handleFilterChange: PropTypes.func,
    handleVisitAnnotation: PropTypes.func,
    currentSectionId: PropTypes.string,
    filters: PropTypes.object,
    defaultFormats: PropTypes.array,
    annotated: PropTypes.bool,
    loaded: PropTypes.bool,
    readingGroups: PropTypes.array,
    setAnnotationOverlayReadingGroup: PropTypes.func,
    t: PropTypes.func
  };

  static defaultProps = {
    annotations: []
  };

  get hasAnnotations() {
    return this.props.sortedAnnotations.length > 0;
  }

  get filters() {
    return this.props.filters;
  }

  get readingGroups() {
    return this.props.readingGroups;
  }

  get hasReadingGroups() {
    return this.readingGroups?.length > 0;
  }

  get selectedGroup() {
    return this.filters.orphaned ? "orphaned" : this.filters.readingGroup;
  }

  get formatFilters() {
    return this.filters.formats;
  }

  get defaultFormats() {
    return this.props.defaultFormats;
  }

  get formatFiltersChanged() {
    return this.formatFilters.length !== this.defaultFormats.length;
  }

  get setAnnotationOverlayReadingGroup() {
    return this.props.setAnnotationOverlayReadingGroup;
  }

  renderHeading() {
    const { handleSeeAllClick, handleFilterChange } = this.props;
    const { readingGroup, ...restFilters } = this.filters;

    return (
      <div className="notes-filtered-list__header">
        <div className="notes-filtered-list__header-start">
          <Partial.Filters
            filterChangeHandler={handleFilterChange}
            filters={restFilters}
          />
        </div>
        <div
          className={classNames({
            "notes-filtered-list__header-end": true,
            "notes-filtered-list__header-end--has-select": this.hasReadingGroups
          })}
        >
          {this.hasReadingGroups && (
            <Partial.GroupFilter
              filterChangeHandler={handleFilterChange}
              selectedGroup={this.selectedGroup}
              readingGroups={this.readingGroups}
              setAnnotationOverlayReadingGroup={
                this.setAnnotationOverlayReadingGroup
              }
            />
          )}
          <button
            onClick={handleSeeAllClick}
            className="notes-filtered-list__see-all button-primary button-primary--dull button-primary--rounded"
          >
            <span className="button-primary__text">
              {this.props.t("actions.see_all")}
            </span>
            <IconComposer
              icon="link24"
              size="default"
              className="notes-filtered-list__see-all-icon button-primary__icon"
              svgProps={{
                role: "img",
                title: this.props.t("external_links.opens_in_new")
              }}
            />
          </button>
        </div>
      </div>
    );
  }

  renderEmptyMessage() {
    if (this.formatFiltersChanged) return <EmptyMessage.NoResults />;
    if (this.selectedGroup === "me")
      return <EmptyMessage.TextNotAnnotatedByMe />;
    if (this.selectedGroup === "orphaned")
      return <EmptyMessage.NoOrphanedAnnotations />;
    return <EmptyMessage.TextNotAnnotatedByGroup />;
  }

  renderList() {
    if (!this.hasAnnotations) return this.renderEmptyMessage();

    return (
      <ul className="notes-filtered-list__section-list">
        {this.props.sortedAnnotations.map(group => {
          return (
            <Partial.Group
              key={group.id}
              annotations={group.annotations}
              sectionName={group.name}
              readerSection={this.props.section}
              visitHandler={this.props.handleVisitAnnotation}
              showAnnotationCreator={
                !(
                  this.selectedGroup === "me" ||
                  this.selectedGroup === "orphaned"
                )
              }
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
        {this.renderList()}
      </div>
    );
  }
}

export default withTranslation()(FilteredList);
