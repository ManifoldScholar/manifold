import React, { Component } from "react";
import PropTypes from "prop-types";
import colorHelper from "color";
import { Helmet } from "react-helmet-async";

export default class ColorScheme extends Component {
  static customProperties = {
    "--accent-primary": color => color,
    "--accent-primary-dark": color => color.desaturate(0.2097).darken(0.1882),
    "--accent-primary-medium": color => color.desaturate(0.2094).darken(0.1157),
    "--accent-primary-light": color => color.saturate(0.36).lighten(0.0804),
    "--accent-primary-dull": color => color.desaturate(0.1157).darken(0.2094),
    "--accent-primary-pale": color => color.desaturate(0.1456).lighten(0.2),
    "--accent-primary-extra-pale": color =>
      color.desaturate(0.0155).lighten(0.2765),
    "--accent-primary-off-white": color =>
      color.desaturate(0.2214).lighten(0.3549),
    "--accent-interaction-light": color => color,
    "--accent-interaction-dark": color => color.saturate(0.1701).darken(0.3529)
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
    return Boolean(this.accentColor());
  }

  setColorScheme() {
    if (!this.hasCustomColor()) return this.restoreDefaultAccent();
    try {
      const accent = colorHelper(this.accentColor());
      Object.keys(this.constructor.customProperties).forEach(customProperty => {
        const transformer = this.constructor.customProperties[customProperty];
        const value = transformer(accent).hex();
        this.setCustomProperty(customProperty, value);
      });
    } catch (error) {
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
        const value = transformer(accent).hex();
        rules.push(`${customProperty}: ${value};`);
      });
      if (rules.length > 0) return `body { ${rules.join(" ")} };`;
    } catch (error) {
      return null;
    }
  }

  render() {
    const cssText = this.colorSchemeAsCSS();
    if (!cssText) return null;
    return <Helmet style={[{ cssText }]} />;
  }
}
