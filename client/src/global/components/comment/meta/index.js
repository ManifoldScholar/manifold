import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import FormattedDate from "global/components/FormattedDate";
import classNames from "classnames";
import Authorize from "hoc/Authorize";
import Avatar from "global/components/avatar/index";

class CommentMeta extends PureComponent {
  static propTypes = {
    creator: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired,
    parent: PropTypes.object,
    t: PropTypes.func
  };

  get avatarUrl() {
    if (this.props.creator.attributes.avatarStyles) {
      return this.props.creator.attributes.avatarStyles.smallSquare;
    } else return null;
  }

  get avatarClassNames() {
    return classNames({
      "annotation-meta__avatar": true,
      "annotation-meta__avatar-placeholder-container": !this.avatarUrl,
      "annotation-meta__avatar-image-container": this.avatarUrl
    });
  }

  get name() {
    const {
      creator: {
        attributes: { isCurrentUser, fullName }
      }
    } = this.props;
    if (isCurrentUser) return this.props.t("common.me_title_case");
    return fullName;
  }

  render() {
    const { comment, t } = this.props;

    return (
      <section className="annotation-meta">
        <div>
          <div aria-hidden className={this.avatarClassNames}>
            <Avatar url={this.avatarUrl} />
          </div>
          <h4 className="annotation-meta__author-name">{this.name}</h4>
          <span className="annotation-meta__datetime">
            <FormattedDate
              format="distanceInWords"
              date={comment.attributes.createdAt}
              suffix
            />
          </span>
        </div>
        <div className="markers">
          {comment.attributes.authorCreated ? (
            <div className="marker marker--tertiary">
              {t("glossary.author_title_case_one")}
            </div>
          ) : null}
          {comment.attributes.deleted ? (
            <div className="marker marker--secondary">
              {t("common.deleted_title_case")}
            </div>
          ) : null}
          <Authorize kind="admin">
            {comment.attributes.flagsCount > 0 ? (
              <div className="marker marker--secondary">
                {t("counts.flag", { count: comment.attributes.flagsCount })}
              </div>
            ) : null}
          </Authorize>
        </div>
      </section>
    );
  }
}

export default withTranslation()(CommentMeta);
