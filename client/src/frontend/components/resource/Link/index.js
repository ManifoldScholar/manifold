import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

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
          <Styled.Link
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
          </Styled.Link>
        );
        break;
      default:
        button = attr.downloadable ? (
          <Styled.Link
            href={attr.attachmentStyles.original}
            className={this.props.buttonClass}
            download={attr.slug}
          >
            <span className="button-primary__text" aria-hidden>
              {t("actions.download")}
            </span>
            <span className="screen-reader-text">
              {`${t("actions.download")} ${attr.kind} “${attr.title}”`}
            </span>
            <IconComposer
              icon="arrowDown16"
              size="default"
              className="button-primary__icon"
            />
          </Styled.Link>
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
