import withPluginReplacement from "hoc/withPluginReplacement";
import DefaultFooter from "./DefaultFooter";
import BrandedFooter from "./BrandedFooter";
import StandaloneFooter from "./StandaloneFooter";
import { useFrontendModeContext, useSettings } from "hooks";

function FrontendFooter(props) {
  const context = useFrontendModeContext();
  const settings = useSettings();

  if (!settings) return null;

  const pressLogo = settings.attributes.pressLogoFooterStyles;
  const isBranded = pressLogo && pressLogo.original;
  const libraryDisabled = settings.attributes.general.libraryDisabled;

  if (libraryDisabled || (context && context.isStandalone))
    return <StandaloneFooter settings={settings} {...props} />;
  if (isBranded) return <BrandedFooter {...props} />;
  return <DefaultFooter {...props} />;
}

export default withPluginReplacement(
  FrontendFooter,
  "Global.Components.Footers.FrontendFooter"
);
