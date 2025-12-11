import { useDispatch } from "react-redux";
import { commonActions } from "actions/helpers";
import PropTypes from "prop-types";
import FooterParts from "./Parts";
import { useAuthentication, useSettings, usePages, useLogout } from "hooks";
import withPluginReplacement from "hoc/withPluginReplacement";
import links from "./Parts/helpers/links";
// import LanguageSelect from "global/components/LanguageSelect";
import * as Styled from "./styles";

function DefaultFooter({ withVersion, ...props }) {
  const dispatch = useDispatch();
  const authentication = useAuthentication();
  const settings = useSettings();
  const pages = usePages();
  const logout = useLogout();

  // Override logout to use the hook that triggers revalidation
  const commonActionsWithLogout = { ...commonActions(dispatch), logout };

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
              commonActions: commonActionsWithLogout,
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

export default withPluginReplacement(
  DefaultFooter,
  "Global.Components.Footers.DefaultFooter"
);
