import React, { Component, PropTypes } from 'react';
import { Maker } from 'components/frontend';
import { Helper } from 'components/global';
import { Link } from 'react-router';
import has from 'lodash/has';
import get from 'lodash/get';

export default class ProjectHero extends Component {

  static displayName = "Project.Hero";

  static propTypes = {
    project: PropTypes.object
  };

  listMakers() {
    const creators = get(this.props.project, 'relationships.creators');
    if (creators && creators.length > 0) {
      return (
        <section className="project-makers">
          {this.props.project.relationships.creators.map((creator) => {
            return (
                <Maker.Avatar key={creator.id} maker={creator}/>
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
          <Helper.SimpleFormat text={this.props.project.attributes.description} />
        </section>
      );
    }
  }

  socialUrl(service, id) {
    let out = ""
    switch(service) {
      case 'twitter':
        out = `http://twitter.com/${id}`
        break;
      case 'instagram':
        out = `http://instagram.com/${id}`
        break;
      case 'facebook':
        out = `http://facebook.com/${id}`
        break;
    }
    return out;
  }

  renderSocial() {
    const attr = this.props.project.attributes;
    const services = ["twitter", "facebook", "instagram"];

    return (
      <section className="project-social">
        <span className="hashtag">#{attr.hashtag}</span>
        <nav className="networks">
          <ul>
            {services.map((service) => {
              const key = `${service}Id`;
              if(!has(attr, key) || !attr[key]) return null;
              return (
                <li key={service}>
                  <a target="_blank" href={this.socialUrl(service, attr[key])} className={service}>
                    <i className={`manicon manicon-${service}`}></i>
                    <span className="screen-reader-text">{`View this project on ${service}`}</span>
                  </a>
                </li>
              )
            })}
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

  renderPurchaseLink() {
    const attr = this.props.project.attributes;
    if (!attr.purchaseUrl) return null;
    return (
      <a target="_blank" href={attr.purchaseUrl} className="button-tagged outline">
        <span className="text">{'Buy '} {attr.purchaseVersionLabel}</span>
        <span className="tag">{attr.purchasePriceMoney}</span>
      </a>
    );
  }

  render() {

    const attr = this.props.project.attributes;
    const heroStyle = {};
    if (attr.heroUrl) {
      heroStyle.backgroundImage = `url(${attr.heroUrl})`;
    }

    return (
      <section
        className="project-detail-hero hero-image"
        style={heroStyle}
      >
        <div className="container">
          <div className="project-figure">
            {this.listMakers()}
            <div className="image">
              <img src={attr.coverUrl}/>
            </div>
            <h1 className="project-title">
              {attr.title}
              <span className="subtitle">
                {attr.subtitle}
              </span>
            </h1>
          </div>
          <div className="project-info">
            {this.renderPublishedText('top')}
            {this.listMakers()}
            <h1 className="project-title">
              {attr.title}
              <span className="subtitle">
                {attr.subtitle}
              </span>
            </h1>
            {this.renderDescription()}
            {this.renderSocial()}
            {this.renderPublishedText('bottom')}
            {this.renderPurchaseLink()}
          </div>
          <div className="project-image">
            <img src={attr.coverUrl}/>
            {this.renderPurchaseLink()}
          </div>
        </div>
      </section>
    );
  }
}
