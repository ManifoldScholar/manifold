import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Navigation from "backend/components/navigation";
import { Link } from "react-router-dom";
import labelId from "helpers/labelId";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";

export default class ProjectCollectionHeader extends PureComponent {
  static displayName = "ProjectCollection.Header";

  static propTypes = {
    projectCollection: PropTypes.object
  };

  static defaultProps = {
    sortId: labelId("project-collection-header-")
  };

  get iconName() {
    return this.props.projectCollection.attributes.smart
      ? "BECollectionSmart64"
      : "BECollectionManual64";
  }

  renderUtility = projectCollection => {
    const smart = projectCollection.attributes.smart;

    return (
      <div className="utility-button-group utility-button-group--inline">
        <Link
          to={lh.link("backendProjectCollectionSettings", projectCollection.id)}
          className="utility-button"
        >
          <IconComposer
            icon="settings32"
            size={26}
            iconClass="utility-button__icon utility-button__icon--highlight"
          />
          <span className="utility-button__text">Settings</span>
        </Link>
        {!smart ? (
          <Link
            to={lh.link(
              "backendProjectCollectionManageProjects",
              projectCollection.id
            )}
            className="utility-button"
          >
            <IconComposer
              icon="BEProject64"
              size={26}
              iconClass="utility-button__icon utility-button__icon--highlight"
            />
            <span className="utility-button__text">Manage Projects</span>
          </Link>
        ) : null}
      </div>
    );
  };

  renderPlaceholder() {
    return (
      <section className="backend-header">
        <div className="backend-header__inner backend-header__inner--empty">
          <header className="backend-header__empty-text">
            <h1 className="screen-reader-text">Project Collections</h1>
            <span>
              Please select a Project Collection from the list to edit its
              content and settings.
            </span>
          </header>
        </div>
      </section>
    );
  }

  render() {
    const { projectCollection } = this.props;
    if (!projectCollection) return this.renderPlaceholder();

    return (
      <Navigation.DetailHeader
        iconName={this.iconName}
        type="projectCollection"
        title={projectCollection.attributes.title}
        utility={this.renderUtility(projectCollection)}
        backUrl={lh.link("backendProjectCollections")}
      />
    );
  }
}
