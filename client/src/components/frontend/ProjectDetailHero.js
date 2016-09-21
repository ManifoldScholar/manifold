import React, { Component, PropTypes } from 'react';
import { MakerFigure } from 'components/frontend';
import { Link } from 'react-router';

export default class ProjectDetailHero extends Component {

  static propTypes = {
    project: PropTypes.object
  };

  listMakers() {
    if (this.props.project.relationships.creators > 0) {
      return (
        <section className="project-makers">
          {this.props.project.relationships.creators.map((creator) => {
            return (
                <MakerFigure key={creator.id} maker={creator}/>
            );
          })}
        </section>
      );
    }
  }

  renderDescription() {
    if (this.props.project.attributes.description) {
      return (
        <section className="project-summary">
          <p>
            {this.props.project.attributes.description}
          </p>
        </section>
      );
    }
  }

  renderSocial() {
    // Currently outputs placeholder markup
    return (
      <section className="project-social">
        <span className="hashtag">{'#ProjectHashtag, #MoreThanOne'}</span>
        <nav className="networks">
          <ul>
            <li>
              <a href="#" className="twitter">
                <i className="manicon manicon-twitter"></i>
                <span className="screen-reader-text">{'View this project on Twitter'}</span>
              </a>
            </li>
            <li>
              <a href="#" className="facebook">
                <i className="manicon manicon-facebook"></i>
                <span className="screen-reader-text">{'View this project on Facebook'}</span>
              </a>
            </li>
            <li>
              <a href="#" className="instagram">
                <i className="manicon manicon-instagram"></i>
                <span className="screen-reader-text">{'View this project on Instagram'}</span>
              </a>
            </li>
          </ul>
        </nav>
      </section>
    );
  }

  renderPublishedText(position) {
    const publishedText = this.props.project.relationships.publishedText;
    if (!publishedText) return null;
    return (
      <section className={'project-entry ' + position}>
        <Link
          to={`/read/${publishedText.id}`}
          className="button-secondary"
        >
          <i className="manicon manicon-glasses"></i>
          {'Start Reading'}
        </Link>

        <Link
          to={`/read/${publishedText.id}`}
          className="button-secondary dull"
        >
          <i className="manicon manicon-bullet-list"></i>
          {'View Contents'}
        </Link>
      </section>

    );
  }

  render() {
    return (
      <div>
        <div className="project-figure">
          {this.listMakers(true)}
          <div className="image">
            <img src={this.props.project.attributes.coverUrl}/>
          </div>
          <h1 className="project-title">
            {this.props.project.attributes.title}
            <span className="subtitle">
              {this.props.project.attributes.subtitle}
            </span>
          </h1>
        </div>
        <div className="project-info">
          {this.renderPublishedText('top')}
          {this.listMakers(true)}
          <h1 className="project-title">
            {this.props.project.attributes.title}
            <span className="subtitle">
              {this.props.project.attributes.subtitle}
            </span>
          </h1>
          {this.renderDescription(true)}
          {this.renderSocial(true)}
          {this.renderPublishedText('bottom')}
          <a href="#" className="button-tagged outline">
            <span className="text">{'Buy '} {'Print Version'}</span>
            <span className="tag">{'$27.50'}</span>
          </a>
        </div>
        <div className="project-image">
          <img src={this.props.project.attributes.coverUrl}/>
          <a href="#" className="button-tagged outline">
            <span className="text">{'Buy '} {'Print Version'}</span>
            <span className="tag">{'$27.50'}</span>
          </a>
        </div>
      </div>
    );
  }
}
