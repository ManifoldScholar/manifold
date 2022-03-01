import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { capitalize } from "utils/string";
import IconComposer from "global/components/utility/IconComposer";

class ResourceLink extends Component {
  static displayName = "Resource.Link";

  static propTypes = {
    attributes: PropTypes.object,
    buttonClass: PropTypes.string,
    t: PropTypes.func
  };

  static defaultProps = {
    buttonClass: "button-primary"
  };

  renderButton(attr) {
    const t = this.props.t;
    let button;
    switch (attr.kind.toLowerCase()) {
      case "link":
        button = (
          <a
            href={attr.externalUrl}
            className={this.props.buttonClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="button-primary__text" aria-hidden>
              {t("navigation.visit_page")}
            </span>
            <span className="screen-reader-text">
              {`${t("navigation.visit_page")} “${attr.title}”`}
            </span>
            <IconComposer
              icon="arrowRight16"
              size="default"
              className="button-primary__icon"
            />
          </a>
        );
        break;
      default:
        button = attr.downloadable ? (
          <a
            href={attr.attachmentStyles.original}
            className={this.props.buttonClass}
            download={attr.slug}
          >
            <span className="button-primary__text" aria-hidden>
              {capitalize(t("actions.download"))}
            </span>
            <span className="screen-reader-text">
              {`${capitalize(t("actions.download"))} ${attr.kind} “${
                attr.title
              }”`}
            </span>
            <IconComposer
              icon="arrowDown16"
              size="default"
              className="button-primary__icon"
            />
          </a>
        ) : null;
        break;
    }

    return button;
  }

  render() {
    return this.renderButton(this.props.attributes);
  }
}

export default withTranslation()(ResourceLink);
