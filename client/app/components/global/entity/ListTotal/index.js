import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

function EntityListTotal({
  linkTo,
  entityName,
  count = 0,
  alignLeft,
  tight,
  className
}) {
  const { t } = useTranslation();

  return (
    <Styled.Wrapper $alignLeft={alignLeft} $tight={tight} className={className}>
      <Styled.Link to={linkTo}>
        <Styled.Value>{count.toLocaleString()}</Styled.Value>{" "}
        {t("counts.entity_total", {
          entity: t(`glossary.${entityName.toLowerCase()}_title_case`, {
            count
          })
        })}
        <Styled.Icon size={30} icon="arrowLongRight16" />
      </Styled.Link>
    </Styled.Wrapper>
  );
}

EntityListTotal.displayName = "Global.Entity.ListTotal";

EntityListTotal.propTypes = {
  linkTo: PropTypes.string.isRequired,
  entityName: PropTypes.string.isRequired,
  count: PropTypes.number,
  alignLeft: PropTypes.bool,
  tight: PropTypes.bool
};

export default EntityListTotal;
