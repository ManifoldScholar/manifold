import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import classNames from "classnames";
import Authorize from "hoc/authorize";
import Avatar from "global/components/avatar/index";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";

export default class AnnotationMeta extends PureComponent {
  static displayName = "Annotation.Meta";

  static propTypes = {
    annotation: PropTypes.object.isRequired,
    subject: PropTypes.string,
    includeMarkers: PropTypes.bool
  };

  static defaultProps = {
    includeMarkers: true
  };

  get subtitle() {
    if (!this.props.subject) return this.dateSubtitle;
    return this.subjectSubtitle;
  }

  get name() {
    const {
      annotation: {
        attributes: { currentUserIsCreator, creatorName }
      }
    } = this.props;
    if (currentUserIsCreator) return "Me";
    return creatorName;
  }

  get subjectSubtitle() {
    const { subject } = this.props;
    return (
      <div className="annotation-meta__subtitle">
        {subject} {this.dateSubtitle}
      </div>
    );
  }

  get dateSubtitle() {
    const { annotation } = this.props;
    return (
      <span className="annotation-meta__datetime">
        <FormattedDate
          format="distanceInWords"
          date={annotation.attributes.createdAt}
        />{" "}
        ago
      </span>
    );
  }

  get avatarUrl() {
    const {
      annotation: {
        attributes: { creatorAvatarStyles }
      }
    } = this.props;

    return creatorAvatarStyles.smallSquare;
  }

  get avatarClassNames() {
    return classNames({
      "annotation-meta__avatar": true,
      "annotation-meta__avatar-placeholder-container": !this.avatarUrl,
      "annotation-meta__avatar-image-container": this.avatarUrl
    });
  }

  renderMarkers(annotation) {
    return (
      <div className="annotation-tag annotation-tag__group">
        {annotation.attributes.authorCreated && (
          <div className="annotation-tag__inner">Author</div>
        )}
        {annotation.attributes.private && (
          <div className="marker marker--secondary">{"Private"}</div>
        )}
        {annotation.attributes.flagsCount > 0 && (
          <Authorize kind="admin">
            <div className="marker marker--secondary">
              {annotation.attributes.flagsCount}
              {annotation.attributes.flagsCount === 1 ? " flag" : " flags"}
            </div>
          </Authorize>
        )}
        {annotation.attributes.readingGroupId && (
          <Link
            to={lh.link(
              "frontendReadingGroupDetail",
              annotation.attributes.readingGroupId,
              {
                text: annotation.attributes.textId
              }
            )}
            className="annotation-tag__inner"
          >
            <div className="annotation-tag__text">
              {annotation.attributes.readingGroupName}
            </div>
          </Link>
        )}
      </div>
    );
  }

  render() {
    const { annotation, includeMarkers } = this.props;
    if (!annotation) return null;
    return (
      <section className="annotation-meta">
        {/* NB: Empty div required for flex-positioning of private/author marker */}
        <div>
          <div className={this.avatarClassNames}>
            <Avatar url={this.avatarUrl} />
          </div>
          <h4 className="annotation-meta__author-name">{this.name}</h4>
          {this.subtitle}
        </div>
        {includeMarkers && this.renderMarkers(annotation)}
      </section>
    );
  }
}
