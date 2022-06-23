import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Date from "./Date";
import Collecting from "frontend/components/collecting";
import * as Styled from "./styles";

class TextBibliographic extends Component {
  static displayName = "Text.Bibliographic";

  static propTypes = {
    text: PropTypes.object.isRequired,
    datePrefix: PropTypes.string,
    datesVisible: PropTypes.bool,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    publishedVisible: PropTypes.bool,
    readUrl: PropTypes.string.isRequired,
    showAuthors: PropTypes.bool,
    showDescriptions: PropTypes.bool,
    showSubtitles: PropTypes.bool,
    showCovers: PropTypes.bool,
    onUncollect: PropTypes.func,
    t: PropTypes.func
  };

  get text() {
    return this.props.text;
  }

  get attributes() {
    return this.text.attributes;
  }

  get title() {
    return this.attributes.titleFormatted;
  }

  get subtitle() {
    if (!this.props.showSubtitles) return null;
    return this.attributes.subtitle;
  }

  get description() {
    if (!this.props.showDescriptions) return null;
    return this.attributes.descriptionFormatted;
  }

  get creatorNames() {
    if (!this.props.showAuthors) return null;
    const creatorNames = this.attributes.creatorNames;
    if (Array.isArray(creatorNames)) {
      return creatorNames.map(n => `${n.firstName} ${n.lastName}`).join(", ");
    }
    return creatorNames;
  }

  get date() {
    if (!this.datesVisible) return null;
    return this.props.date;
  }

  get datePrefix() {
    return this.props.datePrefix;
  }

  get showStatus() {
    return this.props.date || this.publishedVisible;
  }

  get publishedVisible() {
    return this.props.publishedVisible;
  }

  get datesVisible() {
    return this.props.datesVisible;
  }

  get readUrl() {
    return this.props.readUrl;
  }

  render() {
    const t = this.props.t;

    return (
      <Styled.Bibliographic>
        <Styled.Name>
          <Styled.TitleLink to={this.readUrl}>
            <Styled.Title dangerouslySetInnerHTML={{ __html: this.title }} />
            {this.subtitle && (
              <Styled.Subtitle>{this.subtitle}</Styled.Subtitle>
            )}
          </Styled.TitleLink>
          <Styled.CollectingToggle $hasSubtitle={!!this.subtitle}>
            <Collecting.Toggle
              collectable={this.text}
              onUncollect={this.props.onUncollect}
            />
          </Styled.CollectingToggle>
        </Styled.Name>
        {this.creatorNames && (
          <Styled.Creators>
            <span style={{ fontStyle: "italic" }}>{t("common.by")} </span>
            {this.creatorNames}
          </Styled.Creators>
        )}
        {this.description && (
          <Styled.Description
            className="markdown"
            dangerouslySetInnerHTML={{ __html: this.description }}
          />
        )}
        {this.showStatus && (
          <Styled.Status $block>
            {this.date && (
              <Date
                date={this.date}
                datePrefix={this.datePrefix}
                baseClass={this.baseClass}
              />
            )}
            {this.publishedVisible && (
              <Styled.Published>
                {t("dates.published_title_case")}
              </Styled.Published>
            )}
          </Styled.Status>
        )}
      </Styled.Bibliographic>
    );
  }
}

export default withTranslation()(TextBibliographic);
