import React, { useRef, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import withSearchResultHelper from "../searchResultHelper";
import Collapse from "components/global/Collapse";
import useHasMounted from "hooks/useHasMounted";
import { CollapseContext } from "contexts";
import * as Styled from "./styles";

function GenericExcerpts({ excerpts, joinHighlightedFragments }) {
  const scrollTarget = useRef();
  const hasMounted = useHasMounted();
  const { t } = useTranslation();
  const { visible } = useContext(CollapseContext);

  const visibleExcerpts = excerpts.slice(0, 3);
  const expandedExcerpts = excerpts.slice(3);

  // Only scroll when the user collapses the disclosure (true → false).
  // Skipping the initial pass avoids hijacking page scroll when results mount.
  useEffect(() => {
    if (!hasMounted) return;
    if (!visible && scrollTarget.current)
      scrollTarget.current.scrollIntoView({ block: "center" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
