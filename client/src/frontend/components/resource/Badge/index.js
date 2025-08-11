import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComputed from "global/components/icon-computed";
import * as Styled from "./styles";

function ResourceBadge({ kind }) {
  const { t } = useTranslation();

  return (
    <Styled.Wrapper>
      <span>{t("glossary.resource_one")}</span>
      <Styled.Kind>
        <IconComputed.Resource icon={kind} size={20} />
        <span>{kind}</span>
      </Styled.Kind>
    </Styled.Wrapper>
  );
}

ResourceBadge.displayName = "Resource.Badge";

ResourceBadge.propTypes = {
  kind: PropTypes.string.isRequired
};

export default ResourceBadge;
