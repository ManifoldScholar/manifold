import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { ProjectThumbPlaceholder } from './';

export default class ProjectThumb extends Component {
  static propTypes = {
    project: PropTypes.object,
    makers: PropTypes.object,
    hideMeta: PropTypes.bool,
    hideDate: PropTypes.bool,
    hideDesc: PropTypes.bool
  };

  static defaultProps = {
    hideMeta: false,
    hideDate: false,
    hideDesc: false
  };

  lookupMaker = (id) => {
    return this.props.makers[id];
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

    let projectDate;
    if (this.props.hideDate) {
      projectDate = '';
    } else {
      projectDate = (
        <div className="date">
          {'Published June, 2016'}
        </div>
      );
    }

    let projectDesc;
    if (this.props.hideDesc) {
      projectDesc = '';
    } else {
      projectDesc = (
        <p className="description">
          {project.attributes.description}
        </p>
      );
    }

    let projectMeta;
    if (this.props.hideMeta) {
      projectMeta = '';
    } else {
      projectMeta = (
        <div className="meta">
          <h3 className="title">{project.attributes.title}</h3>
          <div className="makers">
            {project.relationships.creators.data.map((makerRel) => {
              const maker = this.lookupMaker(makerRel.id);
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
            <div className="follow-button">
              <i className="manicon manicon-plus-bold"></i>
              {'Follow'}
            </div>
            {cover}
          </figure>
        </div>
        {projectMeta}
      </Link>
    );
  }
}
