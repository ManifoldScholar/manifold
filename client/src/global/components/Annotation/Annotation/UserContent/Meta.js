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
    creator: PropTypes.object,
    annotation: PropTypes.object.isRequired,
    subject: PropTypes.string,
    includeMarkers: PropTypes.bool
  };

  static defaultProps = {
    includeMarkers: true
  };

  get isAnonymous() {
    const { creator } = this.props;
    if (!creator) return true;
  }

  get subtitle() {
    if (!this.props.subject) return this.dateSubtitle;
    return this.subjectSubtitle;
  }

  get name() {
    const { creator, annotation } = this.props;
    if (annotation.attributes.currentUserIsCreator) return "Me";
    if (this.isAnonymous) return "Anonymous";
    return creator.attributes.fullName;
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
    if (this.isAnonymous) return null;
    return this.props.creator.attributes.avatarStyles.smallSquare;
  }

  get avatarClassNames() {
    return classNames({
      "annotation-meta__avatar": true,
      "annotation-meta__avatar--dull":
        !this.isAnonymous && !this.props.creator.attributes.isCurrentUser,
      "annotation-meta__avatar-placeholder-container": !this.avatarUrl,
      "annotation-meta__avatar-image-container": this.avatarUrl
    });
  }

  renderMarkers(annotation) {
    return (
      <div className="markers">
        {annotation.attributes.authorCreated && (
          <div className="marker tertiary">Author</div>
        )}
        {annotation.attributes.private && (
          <div className="marker secondary">{"Private"}</div>
        )}
        {annotation.attributes.flagsCount > 0 && (
          <Authorize kind="admin">
            <div className="marker secondary">
              {annotation.attributes.flagsCount}
              {annotation.attributes.flagsCount === 1 ? " flag" : " flags"}
            </div>
          </Authorize>
        )}
        {annotation.relationships.readingGroup && (
          <div className="marker tertiary">
            <Link
              to={lh.link(
                "frontendReadingGroupDetail",
                annotation.relationships.readingGroup.id,
                {
                  text: annotation.attributes.textId
                }
              )}
              className="marker__link"
            >
              {annotation.relationships.readingGroup.attributes.name}
            </Link>
          </div>
        )}
      </div>
    );
  }

  render() {
    const { annotation, includeMarkers } = this.props;

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
