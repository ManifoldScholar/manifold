import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import FormattedDate from "global/components/FormattedDate";

export default class SourceSummary extends React.PureComponent {
  static propTypes = {
    annotation: PropTypes.object,
    includeDate: PropTypes.bool,
    includeCreator: PropTypes.bool,
    viewable: PropTypes.bool,
    viewInText: PropTypes.func
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
      <>
        {" "}
        &quot;{textSectionTitle}&quot; in{" "}
        <i dangerouslySetInnerHTML={{ __html: textTitle }} />
      </>
    );
  }

  get includeCreator() {
    return this.props.includeCreator;
  }

  get includeDate() {
    return this.props.includeDate;
  }

  get creator() {
    const {
      annotation: {
        attributes: { currentUserIsCreator, creatorName }
      }
    } = this.props;
    if (currentUserIsCreator) return "You";
    return creatorName;
  }

  get action() {
    const {
      annotation: {
        attributes: { format }
      }
    } = this.props;
    return format === "highlight" ? "highlighted" : "annotated";
  }

  render() {
    const { onClick, onHover, annotation } = this.props;

    if (!annotation) return null;

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
            {this.includeCreator && `${this.creator} ${this.action} `}
            {this.source}
            {this.includeDate && (
              <>
                {" "}
                on <FormattedDate date={annotation.attributes.createdAt} />
              </>
            )}
          </span>
          {onClick && (
            <Utility.IconComposer
              icon="arrowLongRight16"
              size={24}
              iconClass="annotation-selection__arrow-icon"
            />
          )}
        </a>
      </div>
    );
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }
}
