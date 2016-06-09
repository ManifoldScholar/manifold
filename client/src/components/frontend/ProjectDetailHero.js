import React, { Component, PropTypes } from 'react';
import { MakerFigure } from './';
import { Link } from 'react-router';

export default class ProjectDetailHero extends Component {

  static propTypes = {
    project: PropTypes.object,
  };

  listMakers() {
    if (this.props.project.relationships.creators > 0) {
      return (
        <section className="project-makers">
          {this.props.project.relationships.creators.map((creator) => {
            return (
              <MakerFigure key={creator.id} maker={creator} />
            );
          })}
        </section>
      );
    }
  }

  renderPublishedText() {
    const publishedText = this.props.project.relationships.publishedText;
    if (!publishedText) return null;
    return (
      <section className="project-entry">
        <Link
          to={`/read/${publishedText.id}`}
          className="button-secondary button-reader"
        >
          <i className="manicon manicon-glasses"></i>
          {'Start Reading'}
        </Link>

        <Link
          to={`/read/${publishedText.id}`}
          className="button-secondary button-reader"
        >
          <i className="manicon manicon-bullet-list"></i>
          {'View Table of Contents'}
        </Link>

        <a href="#" className="button-tagged-dull">
          {'Buy Print Version'}
          <span className="price">{'$27.50'}</span>
        </a>
      </section>

    );
  }

  render() {
    return (
      <div className="project-detail-hero">
        <div className="project-info">
          {this.listMakers()}
          <h1 className="project-title">
            {this.props.project.attributes.title}
            <span className="subtitle">
              {this.props.project.attributes.subtitle}
            </span>
          </h1>
          <section className="project-summary">
            <p>
              {this.props.project.attributes.description}
            </p>
          </section>
          {this.renderPublishedText()}
        </div>
        <div className="project-image">
          <img src={this.props.project.attributes.coverUrl}/>
        </div>
      </div>
    );
  }
}
