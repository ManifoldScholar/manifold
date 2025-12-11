import colorHelper from "tinycolor2";

export default class ColorSchemeGenerator {
  // https://codesandbox.io/s/angry-fermi-5ouic
  static customProperties = {
    "--color-accent-primary": color => color,
    "--color-accent-primary-dark": color =>
      color.desaturate(20.97).darken(18.82),
    "--color-accent-primary-medium": color =>
      color.desaturate(20.94).darken(11.57),
    "--color-accent-primary-light": color => color.saturate(0.36).lighten(8.04),
    "--color-accent-primary-dull": color =>
      color
        .lighten(20)
        .desaturate(14.56)
        .spin(-3),
    "--color-accent-primary-pale": color =>
      color
        .lighten(25.69)
        .saturate(5)
        .spin(2),
    "--color-accent-primary-off-white": color =>
      color
        .lighten(35.49)
        .desaturate(22.14)
        .spin(5),
    "--color-accent-primary-extra-pale": color =>
      color.lighten(27.65).saturate(1.19),
    "--color-interaction-light": color => color,
    "--color-interaction-dark": color =>
      color
        .darken(35.29)
        .saturate(17.01)
        .spin(4)
  };

  constructor(baseColor = "#52e3ac") {
    this._baseColor = baseColor;
  }

  get baseColorHelper() {
    return colorHelper(this._baseColor);
  }

  get hasValidBaseColor() {
    return this.baseColorHelper.isValid();
  }

  get transformations() {
    return this.constructor.customProperties || {};
  }

  get domElement() {
    return document.documentElement;
  }

  get generatedRules() {
    const rules = [];
    Object.keys(this.transformations).forEach(customProperty => {
      const value = this.transform(customProperty);
      rules.push(`${customProperty}: ${value};`);
    });
    return rules;
  }

  updateBaseColor(newColor) {
    this._baseColor = newColor;
  }

  setCustomProperty(name, value) {
    this.domElement.style.setProperty(name, value);
  }

  transform(customProperty) {
    const transformer = this.transformations[customProperty];
    return transformer(this.baseColorHelper).toHexString();
  }

  setColorScheme() {
    Object.keys(this.transformations).forEach(customProperty => {
      const value = this.transform(customProperty);
      this.setCustomProperty(customProperty, value);
    });
  }
}
