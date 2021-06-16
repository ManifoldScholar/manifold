import React, { Component } from "react";
import PropTypes from "prop-types";
import Content from "./Content";
import Meta from "./Meta";
import lh from "helpers/linkHandler";

class TextListListItem extends Component {
  static displayName = "ContentBlock.Types.Texts.ListItem";

  static propTypes = {
    text: PropTypes.object.isRequired,
    baseClass: PropTypes.string,
    showAuthors: PropTypes.bool,
    showCovers: PropTypes.bool,
    showDates: PropTypes.bool,
    showDescriptions: PropTypes.bool,
    showSubtitles: PropTypes.bool,
    utilityPosition: PropTypes.oneOf(["meta", "content"]),
    onUncollect: PropTypes.func
  };

  static defaultProps = {
    baseClass: "text-block"
  };

  get isPublished() {
    return this.props.text.attributes.published;
  }

  get utilityInMeta() {
    return this.props.utilityPosition === "meta";
  }

  get utilityInContent() {
    return this.props.utilityPosition === "content";
  }

  get createdDate() {
    return new Date(this.props.text.attributes.createdAt);
  }

  get updatedDate() {
    return new Date(this.props.text.attributes.updatedAt);
  }

  get datePrefix() {
    // check if latest update occurred > 24hrs after text was created
    const hasUpdate = Math.abs(this.updatedDate - this.createdDate) / 36e5 > 24;

    return hasUpdate ? "Updated" : "Added";
  }

  get readUrl() {
    const text = this.props.text;
    const { slug } = text.attributes;
    return lh.link("reader", slug);
  }

  render() {
    const text = this.props.text;
    const baseClass = this.props.baseClass;

    return (
      <div className={baseClass}>
        <Content
          text={text}
          readUrl={this.readUrl}
          baseClass={baseClass}
          showAuthors={this.props.showAuthors}
          showSubtitles={this.props.showSubtitles}
          showDescriptions={this.props.showDescriptions}
          showCovers={this.props.showCovers}
          datesVisible={this.utilityInContent && this.props.showDates}
          datePrefix={this.datePrefix}
          publishedVisible={this.utilityInContent && this.isPublished}
          onUncollect={this.props.onUncollect}
        />
        <Meta
          text={text}
          baseClass={baseClass}
          datesVisible={this.utilityInMeta && this.props.showDates}
          datePrefix={this.datePrefix}
          publishedVisible={this.utilityInMeta && this.isPublished}
        />
      </div>
    );
  }
}

export default TextListListItem;
