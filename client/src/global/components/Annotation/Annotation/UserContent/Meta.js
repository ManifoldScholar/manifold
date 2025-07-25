import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import FormattedDate from "global/components/FormattedDate";
import classNames from "classnames";
import Authorize from "hoc/Authorize";
import Avatar from "global/components/avatar/index";
import IconComposer from "global/components/utility/IconComposer";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";

class AnnotationMeta extends PureComponent {
  static displayName = "Annotation.Meta";

  static propTypes = {
    annotation: PropTypes.object.isRequired,
    subject: PropTypes.string,
    includeMarkers: PropTypes.bool,
    markerIcons: PropTypes.bool,
    t: PropTypes.func
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
      t,
      annotation: {
        attributes: { currentUserIsCreator, creatorName }
      }
    } = this.props;
    if (currentUserIsCreator) return t("common.me_title_case");
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
          suffix
        />
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
    const { t, markerIcons } = this.props;
    return (
      <div className="annotation-tag annotation-tag--group">
        {annotation.attributes.authorCreated && (
          <div className="annotation-tag__inner">
            {t("glossary.author_one")}
          </div>
        )}
        {annotation.attributes.private &&
          (markerIcons ? (
            <div className="annotation-tag__inner">
              <span className="annotation-tag__text">
                {t("navigation.reading_group.my_private_annotations")}
              </span>
              <IconComposer
                icon="Lock16"
                size={16}
                className="annotation-tag__icon"
              />
            </div>
          ) : (
            <div className="annotation-tag__inner">
              {t("common.private_title_case")}
            </div>
          ))}
        {markerIcons &&
          !annotation.attributes.private &&
          !annotation.attributes.readingGroupId && (
            <div className="annotation-tag__inner">
              {t("navigation.reading_group.my_public_annotations")}
            </div>
          )}
        {annotation.attributes.unresolvedFlagsCount > 0 && (
          <Authorize ability="create" entity="comment">
            <div className="annotation-tag__inner annotation-tag--secondary">
              {t("counts.flag", {
                count: annotation.attributes.unresolvedFlagsCount
              })}
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
            {markerIcons && (
              <IconComposer
                icon="Lock16"
                size={16}
                className="annotation-tag__icon"
              />
            )}
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
          <div aria-hidden className={this.avatarClassNames}>
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

export default withTranslation()(AnnotationMeta);
