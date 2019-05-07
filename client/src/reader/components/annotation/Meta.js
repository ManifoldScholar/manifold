import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import classNames from "classnames";
import Authorize from "hoc/authorize";
import IconComposer from "global/components/utility/IconComposer";

export default class AnnotationDetail extends PureComponent {
  static displayName = "Annotation.Meta";

  static propTypes = {
    creator: PropTypes.object.isRequired,
    annotation: PropTypes.object.isRequired,
    showAnnotationLabel: PropTypes.bool,
    subject: PropTypes.string
  };

  static defaultProps = {
    showAnnotationLabel: false
  };

  get subtitle() {
    if (!this.props.subject) return this.dateSubtitle;
    return this.subjectSubtitle;
  }

  get name() {
    const { creator, annotation } = this.props;
    const isCreator = annotation.attributes.currentUserIsCreator;
    let name = creator.attributes.fullName;
    if (isCreator) name = "Me";
    return <h4 className="author-name">{name}</h4>;
  }

  get subjectSubtitle() {
    const { subject } = this.props;
    return (
      <div className="subtitle">
        {subject} {this.dateSubtitle}
      </div>
    );
  }

  get dateSubtitle() {
    const { annotation } = this.props;
    return (
      <span className="datetime">
        <FormattedDate
          format="distanceInWords"
          date={annotation.attributes.createdAt}
        />{" "}
        ago
      </span>
    );
  }

  get label() {
    const { annotation, showAnnotationLabel } = this.props;
    let label = null;
    if (showAnnotationLabel) {
      label = "Annotation";
    } else if (annotation.attributes.authorCreated) {
      label = "Author";
    }

    if (!label) return null;
  }

  renderMarkers(annotation) {
    if (this.props.showAnnotationLabel) {
      return <div className="marker tertiary">Annotation</div>;
    }
    return (
      <div className="markers">
        {annotation.attributes.authorCreated ? (
          <div className="marker tertiary">Author</div>
        ) : null}
        {annotation.attributes.private ? (
          <div className="marker secondary">{"Private"}</div>
        ) : null}
        <Authorize kind="admin">
          {annotation.attributes.flagsCount > 0 ? (
            <div className="marker secondary">
              {annotation.attributes.flagsCount}
              {annotation.attributes.flagsCount === 1 ? " flag" : " flags"}
            </div>
          ) : null}
        </Authorize>
        {this.props.showAnnotationLabel ? (
          <div className="marker tertiary">{"Annotation"}</div>
        ) : null}
      </div>
    );
  }

  render() {
    const { creator, annotation } = this.props;
    const avatarClass = classNames({
      "author-avatar": true,
      "author-avatar--dull": !creator.attributes.isCurrentUser
    });

    return (
      <section className="annotation-meta">
        {/* NB: Empty div required for flex-positioning of private/author marker */}
        <div>
          <figure className={avatarClass}>
            {creator.attributes.avatarStyles.smallSquare ? (
              <div
                className="author-avatar__image"
                style={{
                  backgroundImage: `url(${
                    creator.attributes.avatarStyles.smallSquare
                  })`
                }}
              >
                <span className="screen-reader-text">
                  Avatar for {creator.attributes.fullName}
                </span>
              </div>
            ) : (
              <div className="author-avatar__no-image">
                <IconComposer
                  icon="avatar64"
                  size={39.385}
                  iconClass="author-avatar__icon"
                />
              </div>
            )}
          </figure>
          {this.name}
          {this.subtitle}
        </div>
        {this.renderMarkers(annotation)}
      </section>
    );
  }
}
