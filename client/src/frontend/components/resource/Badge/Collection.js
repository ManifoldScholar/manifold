import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

function ResourceCollectionBadge({ resourceCount }) {
  const { t } = useTranslation();

  return (
    <Styled.Wrapper>
      <span>
        <IconComposer icon="resourceCollection64" size={20} />
        <span>{t("glossary.resource_collection_short_one")}</span>
      </span>
      <Styled.Kind>
        {t("glossary.resource_with_count", { count: resourceCount })}
      </Styled.Kind>
    </Styled.Wrapper>
  );
}

ResourceCollectionBadge.displayName = "Resource.Badge.Collection";

ResourceCollectionBadge.propTypes = {
  resourceCount: PropTypes.number.isRequired
};

export default ResourceCollectionBadge;
