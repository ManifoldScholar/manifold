import React, { Component } from "react";
import PropTypes from "prop-types";
import Block from "../Block";
import FigureList from "../parts/FigureList";

export default class Annotations extends Component {
  static displayName = "Analytics.Composed.Annotations";

  static propTypes = {};

  get data() {
    return this.props.data ? this.props.data[0] : {};
  }

  get blockWidth() {
    return this.props.width || 100;
  }

  get totalFigure() {
    const { rangeInWords } = this.props;
    const stat = Object.values(this.data).reduce((a, b) => a + b);
    return {
      stat,
      caption: rangeInWords
        ? `Annotations created in ${rangeInWords}.`
        : "Annotations created"
    };
  }

  get publicFigure() {
    const stat = this.data.publicAnnotations;
    return {
      stat,
      caption: "Public"
    };
  }

  get privateFigure() {
    const stat = this.data.privateAnnotations;
    return {
      stat,
      caption: "Private"
    };
  }

  get readingGroupFigure() {
    const stat = this.data.readingGroupAnnotations;
    return {
      stat,
      caption: "in Reading Groups"
    };
  }

  get figures() {
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
