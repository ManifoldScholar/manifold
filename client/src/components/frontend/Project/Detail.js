import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import isEmpty from "lodash/isEmpty";
import { LoadingBlock } from "components/global";

import {
  Event,
  Project,
  TextList,
  ResourceList,
  ResourceCollectionList,
  Layout
} from "components/frontend";

import { Meta } from "components/global";

class Detail extends Component {
  static displayName = "Project.Detail";

  static propTypes = {
    project: PropTypes.object,
    settings: PropTypes.object
  };

  componentDidMount() {
    if (window && window.ScrollTo) window.scrollTo(0, 0);
  }

  shouldShowResources() {
    const project = this.props.project;
    const collectionCount = project.attributes.collectionsCount;
    const resourcesCount = project.attributes.resourcesCount;
    return collectionCount > 0 || resourcesCount > 0;
  }

  shouldShowTexts() {
    const texts = this.props.project.relationships.texts;
    return texts && texts.length > 0;
  }

  shouldShowActivity() {
    if (this.props.project.attributes.hideActivity) return null;
    const events = this.props.project.relationships.events;
    return events && events.length > 0;
  }

  renderMeta = () => {
    const project = this.props.project;
    if (!project.attributes.metadata || isEmpty(project.attributes.metadata))
      return null;
    const containerClass = classNames({
      container: true,
      "flush-top": !this.shouldShowResources()
    });
    return (
      <section>
        <div className={containerClass}>
          <header className="section-heading">
            <div className="main">
              <i className="manicon manicon-tag" />
              <div className="body">
                <h4 className="title">{"About"}</h4>
              </div>
            </div>
          </header>
          <Meta.List metadata={project.attributes.metadataFormatted} />
        </div>
      </section>
    );
  };

  renderActivity = () => {
    if (!this.shouldShowActivity()) return null;
    const project = this.props.project;
    const attr = project.attributes;
    const events = project.relationships.events;
    if (events && events.length === 0) return null;
    return (
      <section>
        <div className="container">
          <header className="section-heading">
            <div className="main">
              <i className="manicon manicon-pulse" />
              <div className="body">
                <h4 className="title">{"Recent Activity"}</h4>
              </div>
            </div>
            <div className="hide-60">
              <Event.AllLink
                count={attr.eventCount}
                threshold={2}
                project={this.props.project}
              />
            </div>
            <div className="show-60">
              <Event.AllLink
                count={attr.eventCount}
                threshold={6}
                project={this.props.project}
              />
            </div>
          </header>
          {/* NB: CSS limits the event list from showing more than 2 events on mobile */}
          <Event.List
            project={this.props.project}
            events={events}
            limit={6}
            columns={3}
          />
        </div>
      </section>
    );
  };

  renderTexts = () => {
    if (!this.shouldShowTexts()) return null;
    const project = this.props.project;
    const containerClass = classNames({
      container: true,
      "flush-top": this.shouldShowActivity()
    });
    const excludes = [];
    if (project.relationships.publishedText) {
      excludes.push(project.relationships.publishedText.id);
    }
    return (
      <section>
        <div className={containerClass}>
          <div className="text-category-list-primary">
            <header className="section-heading">
              <div className="main">
                <i className="manicon manicon-books-stack" />
                <div className="body">
                  <h4 className="title">{"Texts"}</h4>
                </div>
              </div>
            </header>
            {project.relationships.publishedText ? (
              <TextList.Published text={project.relationships.publishedText} />
            ) : null}
            <TextList.Grouped
              excludeIds={excludes}
              categories={project.relationships.textCategories}
              texts={project.relationships.texts}
            />
          </div>
        </div>
      </section>
    );
  };

  renderCollectionsOrResources() {
    if (!this.shouldShowResources()) return null;
    const project = this.props.project;
    if (project.attributes.collectionsCount > 0)
      return this.renderCollections();
    if (project.attributes.resourcesCount > 0) return this.renderResources();
    return null;
  }

  renderCollections = () => {
    const project = this.props.project;
    return (
      <section className="bg-neutral05">
        <div className="container">
          <header className="section-heading">
            <div className="main">
              <i className="manicon manicon-cube-shine" />
              <div className="body">
                <h4 className="title">{"Resources"}</h4>
              </div>
            </div>
          </header>
          <ResourceCollectionList.Grid project={project} />
          <ResourceList.Totals
            count={project.attributes.resourcesCount}
            project={project}
          />
        </div>
      </section>
    );
  };

  renderResources = () => {
    // Currently returns static resource section
    // Logic to check for existing resources should be here

    // Note that this returns a div with two sections, but in production
    // Should return either a group of collections or a group of resources,
    // and not both
    const project = this.props.project;
    return (
      <section className="bg-neutral05">
        <div className="container">
          <header className="section-heading">
            <div className="main">
              <i className="manicon manicon-cube-shine" />
              <div className="body">
                <h4 className="title">{"Resources"}</h4>
              </div>
            </div>
          </header>
          <ResourceList.Thumbnails
            resources={project.relationships.uncollectedResources}
            project={project}
          />
          <ResourceList.Totals
            count={project.attributes.uncollectedResourcesCount}
            project={project}
          />
        </div>
      </section>
    );
  };

  renderNavButtons() {
    return <Layout.ButtonNavigation />;
  }

  render() {
    if (!this.props.project) return <LoadingBlock />;
    return (
      <div>
        <Project.Hero project={this.props.project} />
        {this.renderActivity()}
        {this.renderTexts()}

        {this.renderCollectionsOrResources()}
        {this.renderMeta()}
        {this.renderNavButtons()}
      </div>
    );
  }
}

export default Detail;
