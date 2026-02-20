import FooterParts from "./Parts";
import {
  useAuthentication,
  useSettings,
  usePages,
  useLogout,
  useSignInUpOverlay
} from "hooks";
import links from "./Parts/helpers/links";
// import LanguageSelect from "global/components/LanguageSelect";
import * as Styled from "./styles";

function BrandedFooter(props) {
  const authentication = useAuthentication();
  const settings = useSettings();
  const pages = usePages();
  const logout = useLogout();
  const { toggle: toggleSignInUpOverlay } = useSignInUpOverlay();

  const callbacks = { logout, toggleSignInUpOverlay };

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
              callbacks,
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

export default BrandedFooter;
