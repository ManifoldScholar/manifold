import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { FormattedDate } from "components/global";
import classNames from "classnames";

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

  subtitle() {
    if (!this.props.subject) return this.dateSubtitle();
    return this.subjectSubtitle();
  }

  name() {
    const { creator, annotation } = this.props;
    const isCreator = annotation.attributes.abilities.creator;
    let name = creator.attributes.fullName;
    if (isCreator) name = "Me";
    return (
      <h4 className="author-name">
        {name}
      </h4>
    );
  }

  subjectSubtitle() {
    const { subject } = this.props;
    return (
      <div className="subtitle">
        {subject} {this.dateSubtitle()}
      </div>
    );
  }

  dateSubtitle() {
    const { annotation } = this.props;
    return (
      <datetime>
        <FormattedDate
          format="distanceInWords"
          date={annotation.attributes.createdAt}
        />{" "}
        ago
      </datetime>
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
            {creator.attributes.avatarStyles.smallSquare
              ? <div
                  className="image"
                  style={{
                    backgroundImage: `url(${creator.attributes.avatarStyles
                      .smallSquare})`
                  }}
                >
                  <span className="screen-reader-text">
                    Profile image for {creator.attributes.fullName}
                  </span>
                </div>
              : <div className="no-image">
                  <i className="manicon manicon-person" />
                </div>}
          </figure>
          {this.name()}
          {this.subtitle()}
        </div>
        {annotation.attributes.private
          ? <div className="marker secondary">
              {"Private"}
            </div>
          : null}
        {this.props.showAnnotationLabel
          ? <div className="marker tertiary">
              {"Annotation"}
            </div>
          : null}
      </section>
    );
  }
}
