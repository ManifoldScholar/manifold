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
    this.setOtherColorVars();
  }

  componentDidUpdate() {
    this.setColorScheme();
    this.setOtherColorVars();
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

  get otherColorVars() {
    return {
      "--color-header-background": "headerBackgroundColor",
      "--color-header-foreground": "headerForegroundColor",
      "--color-header-foreground-active": "headerForegroundActiveColor",
      "--color-header-foreground-hover": "headerForegroundActiveColor"
    };
  }

  lighten(hexValue) {
    return `${colorHelper(hexValue)
      .lighten(5)
      .toHexString()}`;
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

  setOtherColorVars() {
    try {
      Object.keys(this.otherColorVars).forEach(varName => {
        const stringValue = this.themeValue(this.otherColorVars[varName]);

        if (!stringValue) return;

        const value = colorHelper(stringValue).toHexString();

        this.colorSchemeGenerator.setCustomProperty(varName, value);

        if (varName === "--color-header-background") {
          this.colorSchemeGenerator.setCustomProperty(
            `${varName}-light`,
            this.lighten(stringValue)
          );
        }
      });
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
    try {
      Object.keys(this.otherColorVars).forEach(varName => {
        const stringValue = this.themeValue(this.otherColorVars[varName]);

        if (!stringValue) return;

        const value = colorHelper(stringValue).toHexString();

        rules.push(`${varName}: ${value};`);

        if (varName === "--color-header-background") {
          rules.push(`${varName}-light: ${this.lighten(stringValue)};`);
        }
      });
    } catch (error) {
      /* eslint-disable no-console */
      console.log(error, this.props.t("errors.color_scheme"));
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
