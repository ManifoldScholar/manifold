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

  // Renders a follow widget (currently shows either "Follow" or "Following")
  renderFollow() {
    // Set following to true to see "Following/Unfollow" widget
    // NB: This behavior will need to be more complex in the future, such that
    // clicking the follow button will change its state (and trigger an action)
    // but not actually swap the buttons until the user has hovered out of
    // the element.
    let following = false;
    let widget = (
      <div className="follow-button">
        <i className="manicon manicon-plus-bold"></i>
        <span className="follow-text">{'Follow'}</span>
      </div>
    );

    if (following) {
      widget = (
        <div className="followed-button">
          <i className="manicon manicon-minus-bold"></i>
          <i className="manicon manicon-check-bold"></i>
          <span className="follow-text">{'Unfollow'}</span>
        </div>
      );
    }

    return widget;
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
            {cover}
            {this.renderFollow()}
          </figure>
        </div>
        {projectMeta}
      </Link>
    );
  }
}
