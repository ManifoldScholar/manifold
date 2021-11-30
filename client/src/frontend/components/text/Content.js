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
      readUrl,
      datePrefix,
      publishedVisible,
      onUncollect
    } = this.props;

    return (
      <Styled.Content>
        <Styled.Inner>
          <Text.Cover text={text} iconOnly={!showCovers} />
          <Bibliographic
            text={text}
            readUrl={readUrl}
            datePrefix={datePrefix}
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
