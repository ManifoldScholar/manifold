import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComputed from "global/components/icon-computed";
import * as Styled from "./styles";

function ResourceBadge({ kind, position, count, showKindOnly = false }) {
  const { t } = useTranslation();

  return (
    <Styled.Wrapper>
      {!showKindOnly && (
        <span>
          {position && count
            ? t("glossary.resource_one_of_total", {
                index: position,
                total: count
              })
            : t("glossary.resource_one")}
        </span>
      )}
      <Styled.Kind>
        <IconComputed.Resource icon={kind} size={20} />
        <span>{kind}</span>
      </Styled.Kind>
    </Styled.Wrapper>
  );
}

ResourceBadge.displayName = "Resource.Badge";

ResourceBadge.propTypes = {
  kind: PropTypes.string.isRequired,
  position: PropTypes.number,
  count: PropTypes.number,
  showKindOnly: PropTypes.bool
};

export default ResourceBadge;
