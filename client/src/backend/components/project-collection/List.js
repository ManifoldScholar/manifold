import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ListItem from "./ListItem";
import List from "backend/components/list";

export default class ProjectCollectionList extends PureComponent {
  static displayName = "ProjectCollection.List";

  static propTypes = {
    projectCollection: PropTypes.object,
    projectCollections: PropTypes.array,
    onShowNew: PropTypes.func.isRequired,
    onCollectionSelect: PropTypes.func.isRequired,
    onToggleVisibility: PropTypes.func.isRequired,
    onCollectionOrderChange: PropTypes.func.isRequired,
    match: PropTypes.object
  };

  render() {
    const { projectCollection } = this.props;
    const active = projectCollection ? projectCollection.id : null;

    return (
      <aside className="aside-wide project-collection-list">
        <List.Orderable
          entities={this.props.projectCollections}
          entityComponent={ListItem}
          entityComponentProps={{
            active,
            clickHandler: this.props.onCollectionSelect,
            visibilityToggleHandler: this.props.onToggleVisibility
          }}
          match={this.props.match}
          orderChangeHandler={this.props.onCollectionOrderChange}
          name="project-collections"
          dragHandle
        />
        <div className="actions">
          <button
            className="button-icon-secondary"
            onClick={this.props.onShowNew}
          >
            <i className="manicon manicon-plus" />
            <span>Create New Collection</span>
          </button>
        </div>
        <p className="instructional-copy">
          Select a Collection to edit its settings, visibility, and contents.
        </p>
      </aside>
    );
  }
}
