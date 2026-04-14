import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSettings } from "hooks";
import * as Styled from "./styles";

function AccessDenied({ entity }) {
  const { t } = useTranslation();
  const settings = useSettings();
  const entityAttrs = entity?.attributes;
  const settingsAttrs = settings?.attributes?.general;

  const heading =
    entityAttrs?.restrictedAccessHeading ||
    settingsAttrs?.restrictedAccessHeading ||
    t("messages.project_authorization_notice.heading");

  const body =
    entityAttrs?.restrictedAccessBody ||
    settingsAttrs?.restrictedAccessBody ||
    t("messages.project_authorization_notice.body");

  return <Styled.Warning icon="stopSign64" heading={heading} body={body} />;
}

AccessDenied.displayName = "ContentBlock.Warning.AccessDenied";

AccessDenied.propTypes = {
  entity: PropTypes.shape({
    attributes: PropTypes.shape({
      restrictedAccessHeading: PropTypes.string,
      restrictedAccessBody: PropTypes.string,
      restrictedAccessBodyFormatted: PropTypes.string
    })
  })
};

export default AccessDenied;
