import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import colorHelper from "tinycolor2";
import ColorSchemeGenerator from "helpers/colorSchemeGenerator";
import { Helmet } from "react-helmet-async";

class ColorScheme extends Component {
  constructor(props) {
    super(props);
    this.colorSchemeGenerator = new ColorSchemeGenerator(this.accentColor());
  }

  componentDidMount() {
    this.setColorScheme();
  }

  componentDidUpdate() {
    this.setColorScheme();
  }

  accentColor(props = this.props) {
    return this.themeValue("accentColor", props);
  }

  themeValue(key, props = this.props) {
    return props?.settings?.attributes?.theme?.[key] || null;
  }

  shouldComponentUpdate(nextProps) {
    const prev = this.accentColor(this.props);
    const next = this.accentColor(nextProps);
    return prev !== next;
  }

  get defaultBaseColor() {
    return "#52e3ac";
  }

  get hasCustomAccentColor() {
    return Boolean(
      this.accentColor() && colorHelper(this.accentColor()).isValid()
    );
  }

  setColorScheme() {
    try {
      this.colorSchemeGenerator.updateBaseColor(
        this.hasCustomAccentColor ? this.accentColor() : this.defaultBaseColor
      );
      this.colorSchemeGenerator.setColorScheme();
    } catch (error) {
      /* eslint-disable no-console */
      console.log(error, this.props.t("errors.color_scheme"));
      /* eslint-enable no-console */
    }
  }

  colorSchemeAsCSS() {
    let rules = [];
    if (!this.hasCustomAccentColor) return null;
    try {
      rules = this.colorSchemeGenerator.generatedRules;
    } catch (error) {
      /* eslint-disable no-console */
      console.log(error, this.props.t("errors.color_scheme"));
      /* eslint-enable no-console */
      return null;
    }
    if (rules.length === 0) return null;
    return rules.join("\n");
  }

  otherColorVarsAsCSS() {
    const rules = [];
    const vars = {
      "--color-header-background": "headerBackgroundColor",
      "--color-header-foreground": "headerForegroundColor",
      "--color-header-foreground-active": "headerForegroundActiveColor",
      "--color-header-foreground-hover": "headerForegroundActiveColor"
    };
    try {
      Object.keys(vars).forEach(varName => {
        const stringValue = this.themeValue(vars[varName]);
        if (!stringValue) return;
        const value = colorHelper(stringValue).toHexString();
        rules.push(`${varName}: ${value};`);
        rules.push(
          `${varName}-light: ${colorHelper(stringValue)
            .lighten(5)
            .toHexString()};`
        );
      });
    } catch (error) {
      /* eslint-disable no-console */
      console.log(error, "Manifold color scheme error!");
      /* eslint-enable no-console */
      return null;
    }
    if (rules.length === 0) return null;
    return rules.join("\n");
  }

  render() {
    const accentStyles = this.colorSchemeAsCSS();
    const otherStyles = this.otherColorVarsAsCSS();
    if (!accentStyles && !otherStyles) return null;
    const cssText = `
      :root {
        ${accentStyles || ""}
        ${otherStyles || ""}
      };
    `;
    return <Helmet style={[{ cssText }]} />;
  }
}

export default withTranslation()(ColorScheme);
