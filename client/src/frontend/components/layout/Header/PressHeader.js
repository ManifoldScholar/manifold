import PropTypes from "prop-types";
import SetCSSProperty from "global/components/utility/SetCSSProperty";
import { useFrontendModeContext, useSettings } from "hooks";
import get from "lodash/get";

const WHITE = "#ffffff";
const BLACK = "#2e2e2e";

const getContrastingColor = bgColorInput => {
  let bgColor = bgColorInput;

  if (bgColor.slice(0, 1) === "#") {
    bgColor = bgColor.slice(1);
  }

  if (bgColor.length === 3) {
    bgColor = bgColor
      .split("")
      .map(hex => hex + hex)
      .join("");
  }

  const r = parseInt(bgColor.substr(0, 2), 16);
  const g = parseInt(bgColor.substr(2, 2), 16);
  const b = parseInt(bgColor.substr(4, 2), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? BLACK : WHITE;
};

export default function PressHeader({
  url: propsUrl,
  label: propsLabel,
  bgColor: propsBgColor
}) {
  const context = useFrontendModeContext();
  const settings = useSettings();

  if (!settings) return null;

  const bgColor =
    propsBgColor ||
    settings.attributes?.theme?.topBarColor ||
    settings.attributes?.theme?.accentColor ||
    "#52e3ac";

  const color = getContrastingColor(bgColor);

  const url =
    propsUrl ||
    context?.project?.standaloneModePressBarUrl ||
    settings?.attributes?.theme?.topBarUrl;

  const projectLabel = context?.project?.standaloneModePressBarText;
  const settingsLabel = settings?.attributes?.theme?.topBarText;

  const pressHeaderMode =
    get(settings, "attributes.theme.topBarMode") || "disabled";
  const isHeaderAlwaysVisible = pressHeaderMode === "enforced";
  const isHeaderOnlyVisibleInStandaloneMode = pressHeaderMode === "enabled";
  const isLibraryDisabled = settings.attributes?.general?.libraryDisabled;
  const isProjectPage = context?.isProject;
  const isStandaloneMode = context?.isStandalone;

  const getLabelType = () => {
    if (propsLabel) return "props";
    if (projectLabel) {
      if (isProjectPage || isLibraryDisabled || isStandaloneMode)
        return "project";
    }
    if (settingsLabel) return "settings";
    return null;
  };

  const labelType = getLabelType();

  const label = (() => {
    if (labelType === "props") return propsLabel;
    if (labelType === "project") return projectLabel;
    if (labelType === "settings") return settingsLabel;
    return null;
  })();

  const visible = (() => {
    if (!labelType) return false;
    if (labelType === "project") return true;
    if (isHeaderAlwaysVisible) return true;
    if (isHeaderOnlyVisibleInStandaloneMode && isStandaloneMode) return true;
    return false;
  })();

  if (!visible) return null;

  const styles = { color, backgroundColor: bgColor };
  const linked = Boolean(url);

  const text = (
    <div className="press-header__inner">
      <span className="press-header__text">{label}</span>
    </div>
  );

  return (
    <SetCSSProperty measurement="height" propertyName="--press-header-height">
      {linked ? (
        <a
          href={url}
          rel="noopener noreferrer"
          className="press-header"
          style={styles}
        >
          {text}
        </a>
      ) : (
        <span className="press-header" style={styles}>
          {text}
        </span>
      )}
    </SetCSSProperty>
  );
}

PressHeader.displayName = "Layout.Header.PressHeader";

PressHeader.propTypes = {
  url: PropTypes.string,
  label: PropTypes.string,
  bgColor: PropTypes.string
};
