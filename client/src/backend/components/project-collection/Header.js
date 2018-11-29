import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Navigation } from "components/backend";
import { Link } from "react-router-dom";
import labelId from "helpers/labelId";
import lh from "helpers/linkHandler";

export default class ProjectCollectionHeader extends PureComponent {
  static displayName = "ProjectCollection.Header";

  static propTypes = {
    projectCollection: PropTypes.object
  };

  static defaultProps = {
    sortId: labelId("project-collection-header-")
  };

  renderUtility = projectCollection => {
    const smart = projectCollection.attributes.smart;

    return (
      <div>
        <Link
          to={lh.link("backendProjectCollectionSettings", projectCollection.id)}
          className="button-bare-primary"
        >
          <i className="manicon manicon-settings" aria-hidden="true" />
          Settings
        </Link>
        {!smart ? (
          <Link
            to={lh.link(
              "backendProjectCollectionManageProjects",
              projectCollection.id
            )}
            className="button-bare-primary"
          >
            <i className="manicon manicon-stack" aria-hidden="true" />
            Manage Projects
          </Link>
        ) : null}
      </div>
    );
  };

  renderPlaceholder() {
    return (
      <section className="backend-header">
        <div className="wrapper">
          <header className="entity-header-primary instructional">
            Please select a Project Collection from the list to edit its content
            and settings.
          </header>
        </div>
      </section>
    );
  }

  render() {
    const { projectCollection } = this.props;
    if (!projectCollection) return this.renderPlaceholder();

    const iconName = projectCollection.attributes.smart
      ? `collection-smart`
      : `collection-manual`;

    return (
      <Navigation.DetailHeader
        iconName={iconName}
        title={projectCollection.attributes.title}
        utility={this.renderUtility(projectCollection)}
        backUrl={lh.link("backendProjectCollections")}
      />
    );
  }
}
