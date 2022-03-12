import React from "react";
import PropTypes from "prop-types";
import { withTranslation, Trans } from "react-i18next";
import Utility from "global/components/utility";
import FormattedDate from "global/components/FormattedDate";
import { capitalize } from "utils/string";

class SourceSummary extends React.PureComponent {
  static propTypes = {
    annotation: PropTypes.object,
    includeDate: PropTypes.bool,
    includeCreator: PropTypes.bool,
    viewable: PropTypes.bool,
    viewInText: PropTypes.func,
    t: PropTypes.func
  };

  static defaultProps = {
    includeDate: false,
    includeCreator: false
  };

  get creatorName() {
    if (!this.props.annotation.relationships.creator) return;
    return this.props.annotation.relationships.creator.attributes.fullName;
  }

  get source() {
    const { textTitle, textSectionTitle } = this.props.annotation.attributes;
    return (
      <Trans
        i18nKey="messages.annotation_summary.source"
        components={{
          text: <i dangerouslySetInnerHTML={{ __html: textTitle }} />
        }}
        values={{ section: textSectionTitle }}
      />
    );
  }

  get includeCreator() {
    return this.props.includeCreator;
  }

  get includeDate() {
    return this.props.includeDate;
  }

  get shortened() {
    return !this.includeCreator || !this.includeDate;
  }

  get creator() {
    const {
      t,
      annotation: {
        attributes: { currentUserIsCreator, creatorName }
      }
    } = this.props;
    if (currentUserIsCreator) return capitalize(t("common.you"));
    return creatorName;
  }

  get action() {
    const {
      annotation: {
        attributes: { format }
      }
    } = this.props;
    return format === "highlight"
      ? "messages.annotation_summary.highlight"
      : "messages.annotation_summary.annotation";
  }

  render() {
    const { onClick, onHover, annotation } = this.props;
    if (!annotation) return null;

    const { textTitle, textSectionTitle } = annotation.attributes;

    /* eslint-disable jsx-a11y/anchor-is-valid */
    return (
      <div className="annotation-selection__source-summary">
        <a
          href="#"
          onClick={onClick}
          onMouseOver={() => onHover(true)}
          onMouseOut={() => onHover(false)}
          className="annotation-selection__source-summary-link"
        >
          <span className="annotation-selection__source-summary-text">
            {!this.shortened && (
              <Trans
                i18nKey={this.action}
                components={{
                  text: <i dangerouslySetInnerHTML={{ __html: textTitle }} />,
                  date: <FormattedDate date={annotation.attributes.createdAt} />
                }}
                values={{ creator: this.creator, section: textSectionTitle }}
              />
            )}
            {this.shortened && this.source}
          </span>
          {onClick && (
            <Utility.IconComposer
              icon="arrowLongRight16"
              size={24}
              className="annotation-selection__arrow-icon"
            />
          )}
        </a>
      </div>
    );
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }
}

export default withTranslation()(SourceSummary);
