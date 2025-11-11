import { useContext } from "react";
import withPluginReplacement from "hoc/withPluginReplacement";
import DefaultFooter from "./DefaultFooter";
import BrandedFooter from "./BrandedFooter";
import StandaloneFooter from "./StandaloneFooter";
import { FrontendModeContext } from "helpers/contexts";
import { useFetch, useFromStore } from "hooks";
import { pagesAPI, requests } from "api";

function FrontendFooter(props) {
  const context = useContext(FrontendModeContext);
  const settings = useFromStore({
    requestKey: "settings",
    action: "select"
  });

  useFetch({
    request: [pagesAPI.index],
    options: { requestKey: requests.gPages }
  });

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
