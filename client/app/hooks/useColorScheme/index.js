import { useEffect, useRef } from "react";
import colorHelper from "tinycolor2";
import ColorSchemeGenerator from "helpers/colorSchemeGenerator";
import { useSettings } from "hooks";

const DEFAULT_BASE_COLOR = "#52e3ac";

const OTHER_COLOR_VARS = {
  "--color-header-background": "headerBackgroundColor",
  "--color-header-foreground": "headerForegroundColor",
  "--color-header-foreground-active": "headerForegroundActiveColor",
  "--color-header-foreground-hover": "headerForegroundActiveColor"
};

function lighten(hexValue) {
  return colorHelper(hexValue)
    .lighten(5)
    .toHexString();
}

export default function useColorScheme() {
  const settings = useSettings();
  const generatorRef = useRef(null);

  const accentColor = settings?.attributes?.theme?.accentColor;
  const hasCustomAccentColor = Boolean(
    accentColor && colorHelper(accentColor).isValid()
  );

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (!generatorRef.current) {
      generatorRef.current = new ColorSchemeGenerator(
        hasCustomAccentColor ? accentColor : DEFAULT_BASE_COLOR
      );
    }

    const generator = generatorRef.current;

    try {
      // Update accent color scheme
      generator.updateBaseColor(
        hasCustomAccentColor ? accentColor : DEFAULT_BASE_COLOR
      );
      generator.setColorScheme();

      // Set other color variables
      Object.keys(OTHER_COLOR_VARS).forEach(varName => {
        const themeKey = OTHER_COLOR_VARS[varName];
        const stringValue = settings?.attributes?.theme?.[themeKey];

        if (!stringValue) return;

        const value = colorHelper(stringValue).toHexString();
        generator.setCustomProperty(varName, value);

        if (varName === "--color-header-background") {
          generator.setCustomProperty(`${varName}-light`, lighten(stringValue));
        }
      });
    } catch (error) {
      console.error("Error setting color scheme:", error);
    }
  }, [accentColor, hasCustomAccentColor, settings?.attributes?.theme]);
}
