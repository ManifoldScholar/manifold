import React, { useRef, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import withSearchResultHelper from "../searchResultHelper";
import Collapse from "global/components/Collapse";
import { CollapseContext } from "helpers/contexts";
import * as Styled from "./styles";

function GenericExcerpts({ excerpts, joinHighlightedFragments }) {
  const scrollTarget = useRef();
  const { t } = useTranslation();
  const { visible } = useContext(CollapseContext);

  const visibleExcerpts = excerpts.slice(0, 3);
  const expandedExcerpts = excerpts.slice(3);

  useEffect(() => {
    if (!visible && scrollTarget.current)
      scrollTarget.current.scrollIntoView({ block: "center" });
  }, [visible]);

  return excerpts.length ? (
    <>
      <Styled.ExcerptsWrapper ref={scrollTarget}>
        {visibleExcerpts.map(excerpt => (
          <Styled.Excerpt key={excerpt.nodeUuid}>
            <Link
              to={excerpt.url}
              dangerouslySetInnerHTML={{
                __html: joinHighlightedFragments(excerpt.contentHighlighted)
              }}
            />
          </Styled.Excerpt>
        ))}
      </Styled.ExcerptsWrapper>
      {!!expandedExcerpts?.length && (
        <>
          <Collapse.Content>
            <>
              <Styled.Shim />
              {expandedExcerpts.map(excerpt => (
                <Styled.Excerpt key={excerpt.nodeUuid}>
                  <Link
                    to={excerpt.url}
                    dangerouslySetInnerHTML={{
                      __html: joinHighlightedFragments(
                        excerpt.contentHighlighted
                      )
                    }}
                    tabIndex={visible ? 0 : -1}
                  />
                </Styled.Excerpt>
              ))}
            </>
          </Collapse.Content>
          <Styled.ExcerptToggle>
            {!visible
              ? t("search.show_all_excerpts")
              : t("search.show_only_relevant")}
          </Styled.ExcerptToggle>
        </>
      )}
    </>
  ) : null;
}

GenericExcerpts.displayName = "Global.Search.Results.Generic.Excerpts";

GenericExcerpts.propTypes = {
  excerpts: PropTypes.array.isRequired,
  joinHighlightedFragments: PropTypes.func.isRequired
};

export default withSearchResultHelper(GenericExcerpts);
