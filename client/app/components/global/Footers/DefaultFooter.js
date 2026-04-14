import { useContext } from "react";
import PropTypes from "prop-types";
import FooterParts from "./Parts";
import {
  useAuthentication,
  useSettings,
  useLogout,
  useSignInUpOverlay
} from "hooks";
import { AppContext } from "app/contexts";
import links from "./Parts/helpers/links";
// import LanguageSelect from "components/global/LanguageSelect";
import * as Styled from "./styles";

function DefaultFooter({ withVersion, ...props }) {
  const authentication = useAuthentication();
  const settings = useSettings();
  const { pages } = useContext(AppContext);
  const logout = useLogout();
  const { toggle: toggleSignInUpOverlay } = useSignInUpOverlay();

  const callbacks = { logout, toggleSignInUpOverlay };

  return (
    <Styled.DefaultFooter className="bg-neutral95">
      <FooterParts.Columns>
        <FooterParts.Column position="right">
          <Styled.Actions>
            <FooterParts.Search />
            {/* <LanguageSelect /> */}
          </Styled.Actions>
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
        </FooterParts.Column>
      </FooterParts.Columns>
      <FooterParts.Columns>
        <FooterParts.Copyright settings={settings} />
      </FooterParts.Columns>
      <FooterParts.PoweredBy
        withVersion={withVersion}
        type="library"
        dull={false}
      />
    </Styled.DefaultFooter>
  );
}

DefaultFooter.propTypes = {
  withVersion: PropTypes.bool
};

export default DefaultFooter;
