import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { ProjectThumbPlaceholder, Follow } from './';

export default class ProjectThumb extends Component {
  static propTypes = {
    project: PropTypes.object,
    hideMeta: PropTypes.bool,
    hideDate: PropTypes.bool,
    hideDesc: PropTypes.bool,
    authenticated: PropTypes.bool,
    favorites: PropTypes.object,
    dispatch: PropTypes.func
  };

  static defaultProps = {
    hideMeta: false,
    hideDate: false,
    hideDesc: false
  };

  renderCover() {
    let cover = (<ProjectThumbPlaceholder />);

    if (this.props.project.attributes.coverUrl) {
      cover = (
        <img src={this.props.project.attributes.coverUrl}
          alt={`Click to view ${this.props.project.attributes.title}`}
        />
      );
    }

    return cover;
  }

  render() {
    const project = this.props.project;

    let projectDate = null;
    if (!this.props.hideDate) {
      projectDate = (
        <div className="date">
          {'Published June, 2016'}
        </div>
      );
    }

    let projectDesc = null;
    if (!this.props.hideDesc) {
      projectDesc = (
        <p className="description">
          {project.attributes.description}
        </p>
      );
    }

    let projectMeta = null;
    if (!this.props.hideMeta) {
      projectMeta = (
        <div className="meta">
          <h3 className="title">{project.attributes.title}</h3>
          <div className="makers">
            {project.relationships.creators.map((maker) => {
              return (
                  <span key={maker.id}>
                {maker.attributes.name}
              </span>
              );
            })}
          </div>
          {projectDate}
          {projectDesc}
        </div>
      );
    }

    let cover;
    if (project.attributes.thumbnailUrl) {
      cover = (
        <img src={project.attributes.thumbnailUrl}
          alt={`Click to view ${project.attributes.title}`}
        />
      );
    } else {
      cover = <ProjectThumbPlaceholder />;
    }

    return (
      <Link to={`/browse/project/${project.id}`}>
        {/* Figure wrapper, controls maximum width of figure */}
        <div className="figure-wrapper">
          <figure>
            {cover}
            <Follow
              project={project}
              authenticated={this.props.authenticated}
              favorites={this.props.favorites}
              dispatch={this.props.dispatch}
            />
          </figure>
        </div>
        {projectMeta}
      </Link>
    );
  }
}
