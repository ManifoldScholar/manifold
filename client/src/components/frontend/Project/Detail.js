import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import fakeData from 'helpers/fakeData';
import get from 'lodash/get';

import {
  Event,
  Project,
  TextList,
  ResourceList,
  ResourceCollectionList,
  Layout
} from 'components/frontend';


class Detail extends Component {

  static displayName = "Project.Detail"

  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {
      activity: fakeData.events,
      categories: [],
      texts: [],
      meta: []
    };

    this.renderActivity = this.renderActivity.bind(this);
    this.renderTexts = this.renderTexts.bind(this);
    this.renderResources = this.renderResources.bind(this);
    this.renderMeta = this.renderMeta.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  renderActivity() {
    const project = this.props.project;
    const attr = project.attributes;
    const events = project.relationships.events;
    if (events.length === 0) return null;
    return (
      <section>
        <div className="container">
          <header className="section-heading">
            <h4 className="title">
              <i className="manicon manicon-pulse"></i>
              {'Recent Activity'}
            </h4>
            <Event.AllLink count={attr.event_count} projectId={project.id} />
          </header>
          <Event.List events={events} limit={6} columns={3} />
        </div>
      </section>
    );
  }

  renderMeta() {
    const project = this.props.project;
    if (!project.attributes.metadata) return null;
    return (
      <section>
        <div className="container">
          <header className="section-heading">
            <h4 className="title">
              <i className="manicon manicon-tag"></i>
              {'Metadata'}
            </h4>
          </header>
          <Project.Meta metadata={project.attributes.metadata} />
        </div>
      </section>
    );
  }

  renderTexts() {
    const project = this.props.project;
    const texts = get(this.props, 'project.relationships.texts');
    if (!texts || texts.length === 0) return null;
    return (
      <section>
        <div className="container">
          <header className="section-heading">
            <h4 className="title">
              <i className="manicon manicon-books-stack"></i>
              {'Texts'}
            </h4>
          </header>
          <TextList.Published text={project.relationships.publishedText} />
          <TextList.Grouped
            excludeIds={[project.relationships.publishedText.id]}
            categories={project.relationships.textCategories}
            texts={project.relationships.texts}
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
      <div>
        <section className="bg-neutral05">
          <div className="container">
            <header className="section-heading">
              <h4 className="title">
                <i className="manicon manicon-cube-shine"></i>
                {'Resources'}
              </h4>
            </header>
            <ResourceCollectionList.Grid
              resourceCollections={fakeData.resourceCollections}
              projectId={project.id}
            />
            <ResourceList.Totals count={2028} projectId={project.id} />
          </div>
        </section>
        <section className="bg-neutral05">
          <div className="container">
            <header className="section-heading">
              <h4 className="title">
                <i className="manicon manicon-cube-shine"></i>
                {'Resources'}
              </h4>
            </header>
            <ResourceList.Thumbnails resources={fakeData.resources} projectId={project.id} />
            <ResourceList.Totals count={2028} projectId={project.id} />
          </div>
        </section>
      </div>
    );
  }

  renderNavButtons() {
    return (<Layout.ButtonNavigation />);
  }

  render() {
    if (!this.props.project) return null;
    return (
      <div>
        <Project.Hero project={this.props.project} />
        {this.renderActivity()}
        {this.renderTexts()}
        {this.renderResources()}
        {this.renderMeta()}
        {this.renderNavButtons()}
      </div>
    );
  }


}

export default Detail;
