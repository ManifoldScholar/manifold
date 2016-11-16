import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Text } from 'components/frontend';
import moment from 'moment';

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
        <div className="asset-link">
          <Link to={`/read/${this.props.text.id}`}>
            <figure className="asset-image">
              { text.attributes.age <= 30 ?
                <i className="manicon manicon-new"></i>
              :
                null
              }
              {this.renderThumbnail(text)}
            </figure>
          </Link>

          <div className="asset-description">
            <Link to={`/read/${this.props.text.id}`}>
              <h3 className="asset-title">
                {text.attributes.title}
                {this.renderSubtitle(text)}
              </h3>
            </Link>
            <datetime className="asset-date">
              {`Added ${moment(text.attributes.createdAt).format("MMMM YYYY")}`}
            </datetime>

            <div className="asset-status">
              <ul className="asset-interactions">
                <li>
                  <Link to={`/read/${this.props.text.id}`}>
                    <i className="manicon manicon-pencil-simple"></i>
                    {text.attributes.annotationsCount}
                  </Link>
                </li>
                <li>
                  <Link to={`/read/${this.props.text.id}`}>
                    <i className="manicon manicon-highlight"></i>
                    {text.attributes.highlightsCount}
                  </Link>
                </li>
                <li>
                  <Link to={`/read/${this.props.text.id}`}>
                    <i className="manicon manicon-bookmark-outline"></i>
                    {text.attributes.bookmarksCount}
                  </Link>
                </li>
              </ul>
            </div>


          </div>
        </div>

        {/* Asset status markup only stub at this point, may be abstracted to child component */}
      </div>
    );
  }
}
