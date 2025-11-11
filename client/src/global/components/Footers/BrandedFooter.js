import PropTypes from "prop-types";
import FooterParts from "./Parts";
import { useFromStore } from "hooks";
import withPluginReplacement from "hoc/withPluginReplacement";
import links from "./Parts/helpers/links";
// import LanguageSelect from "global/components/LanguageSelect";
import * as Styled from "./styles";

function BrandedFooter({ ...props }) {
  const authentication = useFromStore({ path: "authentication" });
  const settings = useFromStore({
    requestKey: "settings",
    action: "select"
  });

  return (
    <Styled.BrandedFooter className="bg-neutral95">
      <FooterParts.Columns>
        <FooterParts.Column position="right" footerType="branded">
          <FooterParts.PressLogo settings={settings} />
        </FooterParts.Column>
        <FooterParts.Column position="left">
          <FooterParts.Navigation>
            {links({ authentication, settings, ...props })}
          </FooterParts.Navigation>
          <Styled.Actions>
            <FooterParts.Search withTopMargin />
            {/* <LanguageSelect /> */}
          </Styled.Actions>
        </FooterParts.Column>
      </FooterParts.Columns>
      <FooterParts.Columns>
        <FooterParts.Copyright settings={settings} />
      </FooterParts.Columns>
      <FooterParts.PoweredBy dull />
    </Styled.BrandedFooter>
  );
}

export default withPluginReplacement(
  BrandedFooter,
  "Global.Components.Footers.BrandedFooter"
);
