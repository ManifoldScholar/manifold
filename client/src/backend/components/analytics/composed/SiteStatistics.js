import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import List from "../parts/List";

export default class SiteStatistics extends Component {
  static displayName = "Analytics.Composed.SiteStatistics";

  static propTypes = {};

  get stats() {
    const { statistics } = this.props;
    if (!statistics) return {};
    return statistics.attributes;
  }

  get items() {
    return [
      {
        icon: "projects64",
        label: "Projects",
        value: this.stats.totalProjectCount
      },
      {
        icon: "textsBook64",
        label: "Texts",
        value: this.stats.totalTextCount
      },
      {
        icon: "BEResourcesBoxes64",
        label: "Resources",
        value: this.stats.totalResourceCount
      },
      {
        icon: "users32",
        label: "Users",
        value: this.stats.totalUserCount
      },
      {
        icon: "interactAnnotate32",
        label: "Annotations",
        value: this.stats.totalAnnotationCount
      },
      {
        icon: "interactComment32",
        label: "Comments",
        value: this.stats.totalCommentCount
      }
    ];
  }

  get blockWidth() {
    return this.props.width || 100;
  }

  render() {
    return (
      <Block
        width={this.blockWidth}
        icon="featureMeasure32"
        title="Site Statistics"
        description="Your Manifold installation’s content and user activity."
      >
        <List items={this.items} />
      </Block>
    );
  }
}
