import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { select } from '../../utils/select';
import { Link } from 'react-router';
import { EventList, PublishedText, GroupedTexts, MetaAttributes, ProjectDetailHero }
  from '../../components/frontend';
import { visibilityShow }
  from '../../actions/shared/ui/visibility';
import { fetchOneProject } from '../../actions/shared/collections';


class ProjectDetailContainer extends Component {

  static fetchData(getState, dispatch, location, params) {
    return Promise.all([
      fetchOneProject(params.id)(dispatch, getState)
    ]);
  }

  static propTypes = {
    project: PropTypes.object,
    creators: PropTypes.array,
    contributors: PropTypes.array,
    texts: PropTypes.array,
    publishedText: PropTypes.object,
    textCategories: PropTypes.array,
    dispatch: PropTypes.func.isRequired
  };

  state = {
    activity: [],
    categories: [],
    texts: [],
    meta: []
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

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

  render() {
    return (
      <div>
        <section className="bg-neutral05">
          <div className="container">
            <ProjectDetailHero
              project={this.props.project}
              publishedText={this.props.publishedText}
              makers={this.props.creators.concat(this.props.contributors)}
              visibilityShow={bindActionCreators((el) => visibilityShow(el), this.props.dispatch)}
            />
          </div>
        </section>
        {this.renderActivity()}
        {this.renderTexts()}
        {this.renderMeta()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const fetchOneProjectResult = state.collections.results.fetchOneProject.entities;
  const projects = state.collections.entities.projects;
  const project = projects[fetchOneProjectResult];
  const { creators, contributors, texts, publishedText, textCategories } =
    select(project, state.collections.entities);
  return {
    project,
    creators: creators || [],
    contributors: contributors || [],
    texts: texts || [],
    publishedText: publishedText || null,
    textCategories: textCategories || []
  };
}

const ProjectDetail = connect(
  mapStateToProps
)(ProjectDetailContainer);

export default ProjectDetail;
