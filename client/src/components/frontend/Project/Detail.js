import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import isEmpty from "lodash/isEmpty";

import {
  Event,
  Project,
  TextList,
  ResourceList,
  ResourceCollectionList,
  Layout
} from "components/frontend";

class Detail extends Component {
  static displayName = "Project.Detail";

  static propTypes = {
    project: PropTypes.object
  };

  constructor() {
    super();
    this.renderActivity = this.renderActivity.bind(this);
    this.renderTexts = this.renderTexts.bind(this);
    this.renderResources = this.renderResources.bind(this);
    this.renderMeta = this.renderMeta.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  onlyShowingMeta() {
    const texts = this.shouldShowTexts();
    const resources = this.shouldShowResources();
    const activity = this.shouldShowActivity();
    const result = !texts && !resources && !activity;
    return result;
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
    const events = this.props.project.relationships.events;
    return events && events.length > 0;
  }

  renderMeta() {
    const project = this.props.project;
    if (!project.attributes.metadata || isEmpty(project.attributes.metadata))
      return null;
    const containerClass = classNames({
      container: true,
      "flush-top": !this.shouldShowResources() || !this.shouldShowResources()
    });
    return (
      <section>
        <div className={containerClass}>
          <header className="section-heading">
            <h4 className="title">
              <i className="manicon manicon-tag" />
              {"Metadata"}
            </h4>
          </header>
          <Project.Meta metadata={project.attributes.metadata} />
        </div>
      </section>
    );
  }

  renderActivity() {
    if (!this.shouldShowActivity()) return null;
    const project = this.props.project;
    const attr = project.attributes;
    const events = project.relationships.events;
    if (events && events.length === 0) return null;
    return (
      <section>
        <div className="container">
          <header className="section-heading">
            <h4 className="title">
              <i className="manicon manicon-pulse" />
              {"Recent Activity"}
            </h4>
            <div className="hide-60">
              <Event.AllLink
                count={attr.eventCount}
                threshold={2}
                projectId={project.id}
              />
            </div>
            <div className="show-60">
              <Event.AllLink
                count={attr.eventCount}
                threshold={6}
                projectId={project.id}
              />
            </div>
          </header>
          {/* NB: CSS limits the event list from showing more than 2 events on mobile */}
          <Event.List events={events} limit={6} columns={3} />
        </div>
      </section>
    );
  }

  renderTexts() {
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
              <h4 className="title">
                <i className="manicon manicon-books-stack" />
                {"Texts"}
              </h4>
            </header>
            {project.relationships.publishedText
              ? <TextList.Published
                  text={project.relationships.publishedText}
                />
              : null}
            <TextList.Grouped
              excludeIds={excludes}
              categories={project.relationships.textCategories}
              texts={project.relationships.texts}
            />
          </div>
        </div>
      </section>
    );
  }

  renderCollectionsOrResources() {
    if (!this.shouldShowResources()) return null;
    const project = this.props.project;
    if (project.attributes.collectionsCount > 0)
      return this.renderCollections();
    if (project.attributes.resourcesCount > 0) return this.renderResources();
    return null;
  }

  renderCollections() {
    const project = this.props.project;
    return (
      <section className="bg-neutral05">
        <div className="container">
          <header className="section-heading">
            <h4 className="title">
              <i className="manicon manicon-cube-shine" />
              {"Resources"}
            </h4>
          </header>
          <ResourceCollectionList.Grid
            resourceCollections={project.relationships.collections}
            projectId={project.id}
          />
          <ResourceList.Totals
            count={project.attributes.resourcesCount}
            projectId={project.id}
          />
        </div>
      </section>
    );
  }

  renderResources() {
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
            <h4 className="title">
              <i className="manicon manicon-cube-shine" />
              {"Resources"}
            </h4>
          </header>
          <ResourceList.Thumbnails
            resources={project.relationships.uncollectedResources}
            projectId={project.id}
          />
          <ResourceList.Totals
            count={project.attributes.uncollectedResourcesCount}
            projectId={project.id}
          />
        </div>
      </section>
    );
  }

  renderNavButtons() {
    return <Layout.ButtonNavigation />;
  }

  render() {
    if (!this.props.project) return null;

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
