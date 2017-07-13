import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";

export default class HeadContent extends Component {
  static propTypes = {
    title: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string
  };

  buildMetaContent(props) {
    if (!props) return null;
    const meta = [];
    Object.keys(props).map(property => {
      if (!props[property]) return null;
      return meta.push({
        property: `og:${property}`,
        content: props[property]
      });
    });
    if (props.description) {
      meta.push({
        name: "description",
        content: props.description
      });
    }
    return meta;
  }

  render() {
    const meta = this.buildMetaContent(this.props);
    return <Helmet meta={meta} title={this.props.title} />;
  }
}
