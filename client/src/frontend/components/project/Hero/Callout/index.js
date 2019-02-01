import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Read from "./types/Read";
import TOC from "./types/TOC";
import Download from "./types/Download";
import Link from "./types/Link";

export default class ProjectHeroCallout extends PureComponent {
  static displayName = "ProjectHero.Callout";

  static propTypes = {
    callout: PropTypes.object.isRequired,
    blockClass: PropTypes.string
  };

  get callout() {
    return this.props.callout;
  }

  get type() {
    return this.callout.attributes.kind;
  }

  render() {
    const typeComponents = {
      read: Read,
      toc: TOC,
      download: Download,
      link: Link,
      default: null
    };

    const TypeComponent = typeComponents[this.type];

    if (!TypeComponent) return null;

    return <TypeComponent {...this.props} />;
  }
}
