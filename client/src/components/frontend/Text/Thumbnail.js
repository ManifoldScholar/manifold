import React, { Component } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";
import Cover from "./Cover";
import { Icon } from "components/global/SVG";
import FormattedDate from "components/global/FormattedDate";

export default class TextThumbnail extends Component {
  static displayName = "Text.Thumbnail";

  static propTypes = {
    text: PropTypes.object
  };

  renderTextInteractions(text) {
    const {
      annotationsCount,
      highlightsCount,
      bookmarksCount
    } = text.attributes;

    return (
      <ul className="text-interactions">
        <li>
          <i className="manicon">
            <Icon.SpeechBubble size={32} />
          </i>
          {highlightsCount}
          <span className="screen-reader-text">
            This text has {highlightsCount} highlights
          </span>
        </li>
        <li>
          <i className="manicon">
            <Icon.PencilSimple size={32} />
          </i>
          {annotationsCount}
          <span className="screen-reader-text">
            This text has {annotationsCount} annotations
          </span>
        </li>
        <li>
          <i className="manicon">
            <Icon.Bookmark size={32} />
          </i>
          {bookmarksCount}
          <span className="screen-reader-text">
            This text has {bookmarksCount} bookmarks
          </span>
        </li>
      </ul>
    );
  }

  render() {
    const text = this.props.text;
    const {
      slug,
      titleFormatted,
      subtitle,
      creatorNames,
      createdAt } = text.attributes;

    return (
      <React.Fragment>
        <Link to={lh.link("reader", slug)}>
          <div className="item-wrapper">
            <figure className="cover">
              <Icon.LoosePages />
            </figure>
            <div className="meta">
              <h3 className="name">
                <span
                  className="title-text"
                  dangerouslySetInnerHTML={{
                    __html: titleFormatted
                  }}
                />
              {subtitle && <span className="subtitle">{subtitle}</span>}
              </h3>
              <div className="relations-list">
                <span style={{ fontStyle: "italic" }}>by </span>
                {creatorNames}
              </div>
            </div>
          </div>
        </Link>
        <div className="text-meta">
          <span className="date-added">
            <FormattedDate prefix="Added" format="MMMM YYYY" date={createdAt} />
          </span>
          <span className="status">Published</span>
          {this.renderTextInteractions(text)}
        </div>
      </React.Fragment>
    );
  }
}
