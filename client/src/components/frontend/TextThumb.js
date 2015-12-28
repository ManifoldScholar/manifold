import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class TextThumb extends Component {

  static propTypes = {
    text: PropTypes.object
  };

  renderSubtitle = (text) => {
    if (!text.attributes.subtitle) return null;
    return (
      <span className="subtitle">
        {text.attributes.subtitle}
      </span>
    );
  };

  // Since we only have demo icons at this point, thumbnail can either be an image or a placeholder icon
  renderThumbnail = (text) => {
    let thumbnail = '';
    if (text.attributes.cover_url) {
      thumbnail = (
        <img src={text.attributes.cover_url} alt={'Thumbnail image for ' + text.attributes.title} />
      );
    } else {
      thumbnail = (
        <div className="asset-image-placeholder">
          {/* Placeholder will go in here */}
        </div>
      );
    }
    return thumbnail;
  };

  render = () => {
    const text = this.props.text;

    return (
      <div className="asset-thumb">
        <Link to={`/read/${this.props.text.id}`} className="asset-link">
          <figure className="asset-image">
            {/*
              Manicon-new can be added for texts that are "new"
              <i className="manicon manicon-new"></i>
            */}
            {this.renderThumbnail(text)}
          </figure>

          <div className="asset-description">
            <h3 className="asset-title">
              {text.attributes.title}
              {this.renderSubtitle(text)}
            </h3>
            <datetime className="asset-date">
              {'Added ' + text.attributes.createdAt}
            </datetime>
          </div>
        </Link>

        {/* Asset status markup only stub at this point, may be abstracted to child component */}
        <div className="asset-status">
          <div className="asset-completion">
            <div className="complete" style={{width: '28%'}}></div>
          </div>

          <ul className="asset-interactions">
            <li>
              <Link to="/">
                <i className="manicon manicon-highlight"></i>
                12
              </Link>
            </li>
            <li>
              <Link to="/">
                <i className="manicon manicon-person-word-bubble"></i>
                31
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  };
}
