import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import FigureList from "../parts/FigureList";

export default class Annotations extends Component {
  static displayName = "Analytics.Composed.Annotations";

  static propTypes = {};

  get data() {
    return this.props.data.data;
  }

  get blockWidth() {
    return this.props.width || 100;
  }

  get totalFigure() {
    return {
      stat: "623",
      caption: "Annotations created in the last 30 days"
    };
  }

  get publicFigure() {
    return {
      stat: "461",
      caption: "Public"
    };
  }

  get privateFigure() {
    return {
      stat: "162",
      caption: "Private"
    };
  }

  get readingGroupFigure() {
    return {
      stat: "224",
      caption: "in Reading Groups"
    };
  }

  get figures() {
    // TODO: get actual data.
    return [
      this.totalFigure,
      this.publicFigure,
      this.privateFigure,
      this.readingGroupFigure
    ];
  }

  render() {
    return (
      <Block width={this.blockWidth} icon="annotate32" title="Annotations">
        <FigureList figures={this.figures} />
      </Block>
    );
  }
}
