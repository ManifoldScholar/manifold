import React, { Component } from "react";
import PropTypes from "prop-types";
import Bibliographic from "./Bibliographic";
import Text from "global/components/text";
import * as Styled from "./styles";

export default class TextContent extends Component {
  static displayName = "Text.Content";

  static propTypes = {
    text: PropTypes.object.isRequired,
    showAuthors: PropTypes.bool,
    showDescriptions: PropTypes.bool,
    showSubtitles: PropTypes.bool,
    showCovers: PropTypes.bool,
    datesVisible: PropTypes.bool,
    datePrefix: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    publishedVisible: PropTypes.bool,
    readUrl: PropTypes.string.isRequired,
    onUncollect: PropTypes.func
  };

  render() {
    const {
      text,
      showCovers,
      showSubtitles,
      showDescriptions,
      showAuthors,
      datesVisible,
      date,
      readUrl,
      datePrefix,
      publishedVisible,
      onUncollect
    } = this.props;

    return (
      <Styled.Content>
        <Styled.Inner>
          {showCovers && <Text.Cover text={text} />}
          <Bibliographic
            text={text}
            readUrl={readUrl}
            datePrefix={datePrefix}
            date={date}
            publishedVisible={publishedVisible}
            showSubtitles={showSubtitles}
            showDescriptions={showDescriptions}
            showAuthors={showAuthors}
            datesVisible={datesVisible}
            onUncollect={onUncollect}
          />
        </Styled.Inner>
      </Styled.Content>
    );
  }
}
