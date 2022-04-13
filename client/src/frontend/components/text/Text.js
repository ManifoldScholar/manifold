import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Content from "./Content";
import Meta from "./Meta";
import lh from "helpers/linkHandler";
import * as Styled from "./styles";

class Text extends Component {
  static displayName = "Text";

  static propTypes = {
    text: PropTypes.object.isRequired,
    showAuthors: PropTypes.bool,
    showCovers: PropTypes.bool,
    showDates: PropTypes.bool,
    showDescriptions: PropTypes.bool,
    showSubtitles: PropTypes.bool,
    utilityPosition: PropTypes.oneOf(["meta", "content"]),
    onUncollect: PropTypes.func,
    t: PropTypes.func
  };

  get text() {
    return this.props.text;
  }

  get textAttributes() {
    return this.text.attributes;
  }

  get isPublished() {
    return this.textAttributes.published;
  }

  get utilityInMeta() {
    return this.props.utilityPosition === "meta";
  }

  get utilityInContent() {
    return this.props.utilityPosition === "content";
  }

  get createdAt() {
    return this.textAttributes.createdAt;
  }

  get updatedAt() {
    return this.textAttributes.updatedAt;
  }

  get createdDate() {
    return new Date(this.createdAt);
  }

  get updatedDate() {
    return new Date(this.updatedAt);
  }

  get publishedAt() {
    return this.textAttributes.publicationDate;
  }

  get hasUpdate() {
    // check if latest update occurred > 24hrs after text was created
    return Math.abs(this.updatedDate - this.createdDate) / 36e5 > 24;
  }

  get date() {
    if (this.publishedAt) return this.publishedAt;
    return this.hasUpdate ? this.updatedAt : this.createdAt;
  }

  get datePrefix() {
    const t = this.props.t;

    if (this.isPublished && this.publishedAt) return null;
    if (this.publishedAt) return t("dates.published_title_case");
    return this.hasUpdate
      ? t("dates.updated_title_case")
      : t("dates.added_title_case");
  }

  get readUrl() {
    const { slug } = this.textAttributes;
    return lh.link("reader", slug);
  }

  render() {
    return (
      <Styled.Block>
        <Content
          text={this.text}
          readUrl={this.readUrl}
          showAuthors={this.props.showAuthors}
          showSubtitles={this.props.showSubtitles}
          showDescriptions={this.props.showDescriptions}
          showCovers={this.props.showCovers}
          datesVisible={this.utilityInContent && this.props.showDates}
          datePrefix={this.datePrefix}
          date={this.date}
          publishedVisible={this.utilityInContent && this.isPublished}
          onUncollect={this.props.onUncollect}
        />
        <Meta
          text={this.text}
          datesVisible={this.utilityInMeta && this.props.showDates}
          datePrefix={this.datePrefix}
          date={this.date}
          publishedVisible={this.utilityInMeta && this.isPublished}
        />
      </Styled.Block>
    );
  }
}

export default withTranslation()(Text);
