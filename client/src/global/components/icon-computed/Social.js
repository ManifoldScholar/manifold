import React, { PureComponent } from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";

export default class IconComputedSocial extends PureComponent {
  static displayName = "IconComputed.Social";

  static propTypes = {
    icon: PropTypes.string.isRequired
  };

  static defaultProps = {
    size: 48
  };

  iconForValue(value) {
    const map = {
      facebook: "socialFacebook32",
      email: "socialEmail32",
      twitter: "socialTwitter32",
      slack: "socialSlack32",
      linkedIn: "socialLinkedIn32",
      instagram: "socialInstagram32",
      github: "socialGithub32",
      google: "socialGoogle32"
    };
    return map[value];
  }

  render() {
    const { icon, ...childProps } = this.props;
    return (
      <Utility.IconComposer icon={this.iconForValue(icon)} {...childProps} />
    );
  }
}
