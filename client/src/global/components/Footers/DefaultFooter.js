import { useDispatch } from "react-redux";
import { commonActions } from "actions/helpers";
import { requests } from "api";
import PropTypes from "prop-types";
import FooterParts from "./Parts";
import { useFromStore } from "hooks";
import withPluginReplacement from "hoc/withPluginReplacement";
import links from "./Parts/helpers/links";
// import LanguageSelect from "global/components/LanguageSelect";
import * as Styled from "./styles";

function DefaultFooter({ withVersion, ...props }) {
  const dispatch = useDispatch();
  const authentication = useFromStore({ path: "authentication" });
  const settings = useFromStore({
    requestKey: "settings",
    action: "select"
  });
  const pages = useFromStore({
    requestKey: requests.gPages,
    action: "select"
  });

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
              commonActions: commonActions(dispatch),
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
