import { useDispatch } from "react-redux";
import { commonActions } from "actions/helpers";
import FooterParts from "./Parts";
import { useAuthentication, useSettings, usePages, useLogout } from "hooks";
import withPluginReplacement from "hoc/withPluginReplacement";
import links from "./Parts/helpers/links";
// import LanguageSelect from "global/components/LanguageSelect";
import * as Styled from "./styles";

function BrandedFooter(props) {
  const dispatch = useDispatch();
  const authentication = useAuthentication();
  const settings = useSettings();
  const pages = usePages();
  const logout = useLogout();

  // Override logout to use the hook that triggers revalidation
  const commonActionsWithLogout = { ...commonActions(dispatch), logout };

  return (
    <Styled.BrandedFooter className="bg-neutral95">
      <FooterParts.Columns>
        <FooterParts.Column position="right" footerType="branded">
          <FooterParts.PressLogo settings={settings} />
        </FooterParts.Column>
        <FooterParts.Column position="left">
          <FooterParts.Navigation>
            {links({
              authentication,
              settings,
              pages,
              commonActions: commonActionsWithLogout,
              ...props
            })}
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
