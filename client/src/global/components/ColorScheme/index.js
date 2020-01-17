import React, { Component } from "react";
import PropTypes from "prop-types";
import colorHelper from "tinycolor2";
import { Helmet } from "react-helmet-async";

export default class ColorScheme extends Component {
  // https://codesandbox.io/s/clever-dust-1tbcz
  static customProperties = {
    "--accent-primary": color => color,
    "--accent-primary-dark": color => color.desaturate(20.97).darken(18.82),
    "--accent-primary-medium": color => color.desaturate(20.94).darken(11.57),
    "--accent-primary-light": color => color.saturate(0.36).lighten(8.04),
    "--accent-primary-dull": color =>
      color
        .lighten(20)
        .desaturate(14.56)
        .spin(-3),
    "--accent-primary-pale": color =>
      color
        .lighten(25.69)
        .saturate(5)
        .spin(2),
    "--accent-primary-off-white": color =>
      color
        .lighten(35.49)
        .desaturate(22.14)
        .spin(5),
    "--accent-primary-extra-pale": color => color.lighten(27.65).saturate(1.19),
    "--accent-interaction-light": color => color,
    "--accent-interaction-dark": color =>
      color
        .darken(35.29)
        .saturate(17.01)
        .spin(4)
  };

  componentDidMount() {
    this.storeOriginalValues();
    this.setColorScheme();
  }

  componentDidUpdate() {
    this.setColorScheme();
  }

  accentColor(props = this.props) {
    if (
      !props ||
      !props.settings ||
      !props.settings.attributes ||
      !props.settings.attributes.theme
    )
      return null;
    return props.settings.attributes.theme.accentColor || null;
  }

  shouldComponentUpdate(nextProps) {
    const prev = this.accentColor(this.props);
    const next = this.accentColor(nextProps);
    return prev !== next;
  }

  storeOriginalValues() {
    const newState = {};
    Object.keys(this.constructor.customProperties).forEach(customProperty => {
      const value = this.readCustomProperty(customProperty);
      newState[customProperty] = value.trim();
    });
    this.setState(newState);
  }

  restoreDefaultAccent() {
    if (!this.state) return;
    Object.keys(this.state).forEach(customProperty => {
      const value = this.state[customProperty];
      this.setCustomProperty(customProperty, value);
    });
  }

  readCustomProperty(name) {
    return getComputedStyle(this.domElement).getPropertyValue(name);
  }

  get domElement() {
    return document.body;
  }

  setCustomProperty(name, value) {
    this.domElement.style.setProperty(name, value);
  }

  didColorChange(prevProps) {
    if (this.accentColor(this.props) === this.accentColor(prevProps)) return;
    this.setColorScheme();
  }

  hasCustomColor() {
    return Boolean(
      this.accentColor() && colorHelper(this.accentColor()).isValid()
    );
  }

  setColorScheme() {
    if (!this.hasCustomColor()) return this.restoreDefaultAccent();
    try {
      Object.keys(this.constructor.customProperties).forEach(customProperty => {
        const accent = colorHelper(this.accentColor());
        const transformer = this.constructor.customProperties[customProperty];
        const value = transformer(accent).toHexString();
        this.setCustomProperty(customProperty, value);
      });
    } catch (error) {
      /* eslint-disable no-console */
      console.log(error, "Manifold color scheme error!");
      /* eslint-enable no-console */
      this.restoreDefaultAccent();
    }
  }

  colorSchemeAsCSS() {
    const rules = [];
    if (!this.hasCustomColor()) return null;
    try {
      const accent = colorHelper(this.accentColor());
      Object.keys(this.constructor.customProperties).forEach(customProperty => {
        const transformer = this.constructor.customProperties[customProperty];
        const value = transformer(accent).toHexString();
        rules.push(`${customProperty}: ${value};`);
      });
      if (rules.length > 0) return `body { ${rules.join(" ")} };`;
    } catch (error) {
      /* eslint-disable no-console */
      console.log(error, "Manifold color scheme error!");
      /* eslint-enable no-console */
      return null;
    }
  }

  render() {
    const cssText = this.colorSchemeAsCSS();
    if (!cssText) return null;
    return <Helmet style={[{ cssText }]} />;
  }
}
