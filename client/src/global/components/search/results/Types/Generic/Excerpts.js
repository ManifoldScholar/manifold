import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import withSearchResultHelper from "../searchResultHelper";
import Collapse from "global/components/Collapse";
import * as Styled from "./styles";

function GenericExcerpts({ excerpts, joinHighlightedFragments }) {
  const scrollTarget = useRef();
  const { t } = useTranslation();

  const visibleExcerpts = excerpts.slice(0, 3);
  const expandedExcerpts = excerpts.slice(3);

  // TODO: Figure out if this was working.
  // const holdScroll = ({ contentHeight }) => {
  //   if (contentHeight !== 0) return;
  //   scrollTarget.current.scrollIntoView({ block: "center" });
  // };

  return excerpts.length ? (
    <>
      <div ref={scrollTarget}>
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
      </div>
      {!!expandedExcerpts?.length && (
        <Collapse>
          <Collapse.Content>
            {visible => (
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
            )}
          </Collapse.Content>
          <Styled.ExcerptToggle>
            {visible =>
              !visible
                ? t("search.show_all_excerpts")
                : t("search.show_only_relevant")
            }
          </Styled.ExcerptToggle>
        </Collapse>
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
