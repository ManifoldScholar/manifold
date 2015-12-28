import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { select } from '../../utils/select';
import {Link} from 'react-router';
import { EventList, PublishedText, GroupedTexts, MetaAttributes, ProjectDetailHero } from '../../components/frontend';
import { fetchOneProject } from '../../actions/shared/collections';
import connectData from '../../decorators/connectData';

function fetchData(getState, dispatch, location, params) {
  return Promise.all([
    fetchOneProject(params.id)(dispatch, getState)
  ]);
}

function mapStateToProps(state) {
  const fetchOneProjectResult = state.collections.results.fetchOneProject.entities;
  const projects = state.collections.entities.projects;
  const project = projects[fetchOneProjectResult];
  const {creators, contributors, texts, textCategories} = select(project.relationships, state.collections.entities);

  return {
    project: project,
    creators: creators,
    contributors: contributors,
    texts: texts,
    textCategories: textCategories
  };
}

@connectData(fetchData)
@connect(mapStateToProps)
export default class ProjectDetail extends Component {

  static propTypes = {
    project: PropTypes.object,
    creators: PropTypes.array,
    contributors: PropTypes.array,
    texts: PropTypes.array,
    textCategories: PropTypes.array,
    dispatch: PropTypes.func.isRequired
  };

  state = {
    activity: [],
    categories: [],
    texts: [],
    meta: []
  };


  renderActivity = () => {
    if (!this.state.activity.length > 0) return null;
    return (
        <section>
          <div className="container">
            <header className="rel">
              <h4 className="section-heading">
                <i className="manicon manicon-pulse"></i>
                {'Recent Activity'}
              </h4>
              <div className="section-heading-utility-right">
                <Link to={`#`} className="button-primary">
                  See all Activity
                </Link>
              </div>
            </header>
            <EventList events={this.state.activity} />
          </div>
        </section>
    );
  };

  renderMeta = () => {
    if (!this.state.meta.length > 0) return null;
    return (
      <section>
        <div className="container">
          <header className="rel">
            <h4 className="section-heading">
              <i className="manicon manicon-tag"></i>
                {'Metadata'}
            </h4>
          </header>
          <MetaAttributes data={this.state.meta} />
        </div>
      </section>
    );
  };

  renderTexts = () => {
    if (!this.props.texts.length > 0) return null;
    return (
      <section>
        <div className="container">
          <header className="rel">
            <h4 className="section-heading">
              <i className="manicon manicon-books-stack"></i>
              {'Texts'}
            </h4>
          </header>
          <PublishedText texts={this.props.texts} />
          <GroupedTexts categories={this.props.textCategories} texts={this.props.texts} />
        </div>
      </section>
    );
  };

  render = () => {
    const project = this.props.project;
    const makers = this.props.creators.concat(this.props.contributors);

    return (
      <div>
        <section className="neutral20">
          <div className="container">
            <ProjectDetailHero project={project} makers={makers} />
          </div>
        </section>
        {this.renderActivity()}
        {this.renderTexts()}
        {this.renderMeta()}
      </div>
    );
  };
}
