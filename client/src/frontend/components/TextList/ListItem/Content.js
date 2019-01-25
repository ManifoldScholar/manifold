import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Bibliographic from "./Bibliographic";
import Cover from "frontend/components/text/Cover";
import lh from "helpers/linkHandler";

export default class TextListListItemContent extends Component {
  static displayName = "TextList.ListItem.Content";

  static propTypes = {
    baseClass: PropTypes.string,
    text: PropTypes.object.isRequired,
    showAuthors: PropTypes.bool,
    showDescriptions: PropTypes.bool,
    showSubtitles: PropTypes.bool,
    datesVisible: PropTypes.bool,
    publishedVisible: PropTypes.bool
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
    return this.props.text.attributes.description;
  }

  get creatorNames() {
    if (!this.props.showAuthors) return null;
    return this.props.text.attributes.creatorNames;
  }

  get date() {
    if (!this.props.datesVisible) return null;
    return this.props.text.attributes.createdAt;
  }

  render() {
    const text = this.props.text;
    const { slug } = text.attributes;
    const baseClass = this.props.baseClass;

    return (
      <Link to={lh.link("reader", slug)} className={`${baseClass}__link`}>
        <div className={`${baseClass}__inner`}>
          <Cover text={text} baseClass={baseClass} />
          <div className={`${this.props.baseClass}__content`}>
            <Bibliographic
              baseClass={baseClass}
              title={this.title}
              subtitle={this.subtitle}
              date={this.date}
              description={this.description}
              creatorNames={this.creatorNames}
              publishedVisible={this.props.publishedVisible}
            />
          </div>
        </div>
      </Link>
    );
  }
}
