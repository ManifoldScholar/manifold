import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Text } from 'components/frontend';

export default class TextThumbnail extends Component {

  static displayName = "Text.Thumbnail";

  static propTypes = {
    text: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.renderThumbnail = this.renderThumbnail.bind(this);
    this.renderSubtitle = this.renderSubtitle.bind(this);
  }

  renderSubtitle(text) {
    // if (!text.attributes.subtitle) return null;
    return (
      <span className="subtitle">
        {text.attributes.subtitle}
      </span>
    );
  }

  // Since we only have demo icons at this point, thumbnail can either be an image or a
  // placeholder icon
  renderThumbnail(text) {
    let thumbnail = null;
    if (text.attributes.coverUrl) {
      thumbnail = (
        <img src={text.attributes.coverUrl} alt={'Thumbnail image for ' + text.attributes.title} />
      );
    } else {
      thumbnail = <Text.Placeholder />;
    }
    return thumbnail;
  }

  render() {
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
          <ul className="asset-interactions">
            <li>
              <Link to="/">
                <i className="manicon manicon-pencil-simple"></i>
                12
              </Link>
            </li>
            <li>
              <Link to="/">
                <i className="manicon manicon-word-bubble"></i>
                12
              </Link>
            </li>
            <li>
              <Link to="/">
                <i className="manicon manicon-bookmark-outline"></i>
                31
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
