import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import classNames from "classnames";
import { Icon } from "global/components/svg";

export default class TextCover extends PureComponent {
  static displayName = "Text.Cover";

  static propTypes = {
    text: PropTypes.object.isRequired,
    iconOnly: PropTypes.bool,
    baseClass: PropTypes.string
  };

  static defaultProps = {
    iconOnly: true,
    baseClass: "text-cover"
  };

  get text() {
    return this.props.text;
  }

  get hasCover() {
    if (this.props.iconOnly) return false;
    return get(this.text.attributes, "coverStyles.smallPortrait");
  }

  render() {
    const elemClass = `${this.props.baseClass}__cover`;
    const modifier = this.hasCover ? "image" : "svg";

    return (
      <figure className={`${elemClass} ${elemClass}--${modifier}`}>
        {this.hasCover ? (
          <img
            src={this.text.attributes.coverStyles.smallPortrait}
            alt={"Thumbnail image for " + this.text.attributes.titlePlaintext}
            className={classNames(this.props.baseClass)}
          />
        ) : (
          <Icon.LoosePages
            size={78}
            iconClass={classNames(this.props.baseClass)}
          />
        )}
      </figure>
    );
  }
}
