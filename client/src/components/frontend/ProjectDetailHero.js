import React, { Component, PropTypes } from 'react';
import { MakerFigure } from './';

export default class ProjectDetailHero extends Component {

  static propTypes = {
    project: PropTypes.object,
    makers: PropTypes.array
  };

  listMakers = () => {
    if (this.props.makers.length > 0) {
      return (
          <section className="project-makers">
            {this.props.makers.map((maker) => {
              return (
                  <MakerFigure key={maker.id} maker={maker} />
              );
            })}
          </section>
      );
    }
  };

  render = () => {
    return (
        <div className="project-detail-hero">
          <div className="project-info">
            {this.listMakers()}
            <h1 className="project-title">
              {this.props.project.attributes.title}<span className="subtitle">{this.props.project.attributes.subtitle}</span>
            </h1>
            <section className="project-summary">
              <p>
                {this.props.project.attributes.description}
              </p>
            </section>

            <section className="project-entry">
              <a href="#" className="button-secondary button-reader">
                <i className="manicon manicon-glasses"></i>
                {'Start Reading'}
              </a>

              <a href="#" className="button-secondary-dull button-toc">
                <i className="manicon manicon-bullet-list"></i>
                {'View Table of Contents'}
              </a>

              <a href="#" className="button-tagged-dull">
                {'Buy Print Version'}
                <span className="price">{'$27.50'}</span>
              </a>
            </section>
          </div>
          <div className="project-image">
            <img src={this.props.project.attributes.coverUrl}/>
          </div>
        </div>
    );
  };
}
