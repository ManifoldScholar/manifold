import React, { Component } from "react";
import PropTypes from "prop-types";
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

  render() {
    const {
      text,
      baseClass,
      showCovers,
      readUrl,
      datePrefix,
      publishedVisible
    } = this.props;

    return (
      <div className={`${baseClass}__content`}>
        <div className={`${baseClass}__inner`}>
          <Text.Cover
            text={text}
            baseClass={baseClass}
            iconOnly={!showCovers}
          />
          <Bibliographic
            baseClass={baseClass}
            text={text}
            readUrl={readUrl}
            datePrefix={datePrefix}
            publishedVisible={publishedVisible}
          />
        </div>
      </div>
    );
  }
}
