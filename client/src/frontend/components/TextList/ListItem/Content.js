import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Bibliographic from "./Bibliographic";
import Text from "global/components/text";

export default class TextListListItemContent extends Component {
  static displayName = "TextList.ListItem.Content";

  static propTypes = {
    baseClass: PropTypes.string,
    text: PropTypes.object.isRequired,
    showAuthors: PropTypes.bool,
    showDescriptions: PropTypes.bool,
    showSubtitles: PropTypes.bool,
    showCovers: PropTypes.bool,
    datesVisible: PropTypes.bool,
    datePrefix: PropTypes.string,
    publishedVisible: PropTypes.bool,
    readUrl: PropTypes.string.isRequired
  };

  get title() {
    return this.props.text.attributes.titleFormatted;
  }

  get subtitle() {
    if (!this.props.showSubtitles) return null;
    return this.props.text.attributes.subtitle;
  }

  get description() {
    if (!this.props.showDescriptions) return null;
    return (
      this.props.text.attributes.descriptionFormatted ||
      this.props.text.attributes.descriptionFormatted
    );
  }

  get creatorNames() {
    if (!this.props.showAuthors) return null;
    return this.props.text.attributes.creatorNames;
  }

  get date() {
    if (!this.props.datesVisible) return null;
    return this.props.text.attributes.updatedAt;
  }

  get readUrl() {
    return this.props.readUrl;
  }

  render() {
    const text = this.props.text;
    const baseClass = this.props.baseClass;

    return (
      <div className={`${baseClass}__content`}>
        <div className={`${baseClass}__inner`}>
          <Link to={this.readUrl}>
            <Text.Cover
              text={text}
              baseClass={baseClass}
              iconOnly={!this.props.showCovers}
            />
          </Link>
          <Bibliographic
            baseClass={baseClass}
            readUrl={this.readUrl}
            title={this.title}
            subtitle={this.subtitle}
            date={this.date}
            datePrefix={this.props.datePrefix}
            description={this.description}
            creatorNames={this.creatorNames}
            publishedVisible={this.props.publishedVisible}
          />
        </div>
      </div>
    );
  }
}
