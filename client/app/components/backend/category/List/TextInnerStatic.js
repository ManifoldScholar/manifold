import React, { Component } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import Text from "global/components/text";
import Utility from "global/components/utility";
import { withTranslation } from "react-i18next";

class TextInnerStatic extends Component {
  static displayName = "Category.List.Texts.TextStatic";

  static propTypes = {
    text: PropTypes.object.isRequired,
    category: PropTypes.object,
    t: PropTypes.func
  };

  get text() {
    return this.props.text;
  }

  get category() {
    return this.props.category;
  }

  get labels() {
    const labels = [];
    if (this.text.attributes.ignoreAccessRestrictions)
      labels.push("unrestricted");
    return labels;
  }

  render() {
    return (
      <>
        <div role="presentation" aria-hidden className="texts-list__details">
          <div className="texts-list__icon">
            <Text.Cover text={this.text} iconOnly={false} />
          </div>
          <div className="texts-list__title-wrapper">
            <h3 className="texts-list__title">
              <span
                dangerouslySetInnerHTML={{
                  __html: this.text.attributes.titleFormatted
                }}
              />
              <span className="texts-list__subtitle">
                {this.text.attributes.subtitle}
              </span>
              {this.labels.length > 0 && (
                <span className="texts-list__labels">
                  {this.labels.map(label => (
                    <span key={label} className="texts-list__label">
                      {label}
                    </span>
                  ))}
                </span>
              )}
            </h3>
            <span className="texts-list__date">
              <FormattedDate
                prefix={this.props.t("dates.added_title_case")}
                format="MMMM, yyyy"
                date={this.text.attributes.createdAt}
              />
            </span>
          </div>
        </div>
        <div className="texts-list__utility">
          <button className="texts-list__button texts-list__button--notice">
            <Utility.IconComposer icon="delete32" size={26} />
            <span className="screen-reader-text">
              {this.props.t("projects.category.delete_text")}
            </span>
          </button>
          <div className="texts-list__button">
            <Utility.IconComposer icon="annotate32" size={26} />
            <span className="screen-reader-text">
              {this.props.t("projects.category.edit_text")}
            </span>
          </div>
          <div className="texts-list__button texts-list__drag-handle">
            <Utility.IconComposer icon="grabber32" size={26} />
            <span className="screen-reader-text">
              {this.props.t("projects.category.drag")}
            </span>
          </div>
        </div>
      </>
    );
  }
}

export default withTranslation()(TextInnerStatic);
