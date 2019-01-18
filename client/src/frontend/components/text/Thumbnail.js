import React, { Component } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import get from "lodash/get";
import classNames from "classnames";
import { Link } from "react-router-dom";
import Cover from "./Cover";
import FormattedDate from "global/components/FormattedDate";
import { Icon } from "global/components/svg";

export default class TextThumbnail extends Component {
  static displayName = "Text.Thumbnail";

  static propTypes = {
    text: PropTypes.object.isRequired,
    visibility: PropTypes.object,
    blockClass: PropTypes.string
  };

  static defaultProps = {
    visibility: {
      showAuthors: true,
      showCovers: true,
      showDates: true,
      showDescriptions: false,
      showSubtitles: false
    },
    blockClass: "text-block"
  };

  renderTextInteractions(text) {
    const {
      annotationsCount,
      highlightsCount,
      bookmarksCount
    } = text.attributes;
    const blockClass = this.props.blockClass;

    return (
      <ul className={`${blockClass}__interaction-list`}>
        <li className={`${blockClass}__interaction`}>
          <Icon.SpeechBubble
            size={32}
            iconClass={`${blockClass}__interaction-icon`}
          />
          {highlightsCount}
          <span className="screen-reader-text">
            This text has {highlightsCount} highlights
          </span>
        </li>
        <li className={`${blockClass}__interaction`}>
          <Icon.PencilSimple
            size={32}
            iconClass={`${blockClass}__interaction-icon`}
          />
          {annotationsCount}
          <span className="screen-reader-text">
            This text has {annotationsCount} annotations
          </span>
        </li>
        <li className={`${blockClass}__interaction`}>
          <Icon.Bookmark
            size={32}
            iconClass={`${blockClass}__interaction-icon`}
          />
          {bookmarksCount}
          <span className="screen-reader-text">
            This text has {bookmarksCount} bookmarks
          </span>
        </li>
      </ul>
    );
  }

  renderCover(showCovers) {
    const hasCover =
      showCovers && get(this.props.text.attributes, "coverStyles.small");
    const elemClass = `${this.props.blockClass}__cover`;
    const modifier = hasCover ? "image" : "svg";

    return (
      <figure className={`${elemClass} ${elemClass}--${modifier}`}>
        <Cover
          text={this.props.text}
          blockClass={`${this.props.blockClass}__cover-${modifier}`}
        />
      </figure>
    );
  }

  renderInnerContent(text) {
    const {
      titleFormatted,
      subtitle,
      description,
      creatorNames
    } = text.attributes;
    const {
      showAuthors,
      showDates,
      showDescriptions,
      showSubtitles
    } = this.props.visibility;
    const blockClass = this.props.blockClass;

    return (
      <div className={`${blockClass}__content`}>
        <h3 className={`${blockClass}__name`}>
          <span
            className={`${blockClass}__title`}
            dangerouslySetInnerHTML={{
              __html: titleFormatted
            }}
          />
          {showSubtitles && subtitle && (
            <span className={`${blockClass}__subtitle`}>{subtitle}</span>
          )}
        </h3>
        {showAuthors && (
          <div className={`${blockClass}__creators`}>
            <span style={{ fontStyle: "italic" }}>by </span>
            {creatorNames}
          </div>
        )}
        {showDescriptions && description && (
          <p className={`${blockClass}__description`}>{description}</p>
        )}
        {!showAuthors && !showDescriptions && this.renderDateStatus(showDates)}
      </div>
    );
  }

  renderDateStatus(showDates, inline) {
    const { createdAt } = this.props.text.attributes;
    const blockClass = this.props.blockClass;

    return (
      <React.Fragment>
        {showDates && (
          <span
            className={classNames(`${blockClass}__date`, {
              [`${blockClass}__date--inline`]: inline,
              [`${blockClass}__date--block`]: !inline
            })}
          >
            <FormattedDate prefix="Added" format="MMMM YYYY" date={createdAt} />
          </span>
        )}
        <span className={`${blockClass}__status`}>Published</span>
      </React.Fragment>
    );
  }

  render() {
    const text = this.props.text;
    const { slug } = text.attributes;
    const {
      showAuthors,
      showCovers,
      showDates,
      showDescriptions
    } = this.props.visibility;
    const blockClass = this.props.blockClass;

    return (
      <div className={blockClass}>
        <Link to={lh.link("reader", slug)} className={`${blockClass}__link`}>
          <div className={`${blockClass}__inner`}>
            {this.renderCover(showCovers)}
            {this.renderInnerContent(text)}
          </div>
        </Link>
        <div className={`${blockClass}__meta`}>
          {(showAuthors || showDescriptions) &&
            this.renderDateStatus(showDates, true)}
          {this.renderTextInteractions(text)}
        </div>
      </div>
    );
  }
}
