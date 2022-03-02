import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import * as Styled from "./styles";

function TOCListNode({ id, anchor, title, textSlug, textTitle, children }) {
  const { t } = useTranslation();

  const to = lh.link("readerSection", textSlug, id, anchor ? `#${anchor}` : "");

  return (
    <>
      <Styled.Link to={to}>
        <span>{title}</span>
        {textTitle && (
          <Styled.TextTitle>
            {t("common.in")} <i>{textTitle}</i>
          </Styled.TextTitle>
        )}
      </Styled.Link>
      {children}
    </>
  );
}

TOCListNode.displayName = "ContentBlock.Types.TOC.Node";

TOCListNode.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  textSlug: PropTypes.string.isRequired,
  anchor: PropTypes.string,
  children: PropTypes.node
};

export default TOCListNode;
