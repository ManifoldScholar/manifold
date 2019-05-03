import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import EntitiesList from "backend/components/list/EntitiesList";
import ListItem from "./ListItem";

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
        <EntitiesList
          entities={this.props.projectCollections}
          entityComponent={ListItem}
          entityComponentProps={{
            active,
            clickHandler: this.props.onCollectionSelect,
            visibilityToggleHandler: this.props.onToggleVisibility
          }}
          useDragHandle
          listStyle="bare"
          callbacks={{
            onReorder: this.props.onCollectionOrderChange
          }}
        />
        <div className="actions">
          <button
            className="button-icon-secondary"
            onClick={this.props.onShowNew}
            type="button"
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
