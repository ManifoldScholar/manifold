import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import classNames from "classnames";
import Authorize from "hoc/authorize";

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

  renderMarkers(annotation) {
    return (
      <div className="markers">
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
      dull: !creator.attributes.isCurrentUser
    });

    return (
      <section className="annotation-meta">
        {/* NB: Empty div required for flex-positioning of private/author marker */}
        <div>
          <figure className={avatarClass}>
            {creator.attributes.avatarStyles.smallSquare ? (
              <div
                className="image"
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
              <div className="no-image">
                <i className="manicon manicon-person" aria-hidden="true" />
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
