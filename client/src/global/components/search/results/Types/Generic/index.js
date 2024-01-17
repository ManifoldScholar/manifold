import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Collecting from "frontend/components/collecting";
import withSearchResultHelper from "../searchResultHelper";
import Excerpts from "./Excerpts";
import Collapse from "global/components/Collapse";
import { maybeHtml, maybeReactNode } from "helpers/maybeHtml";
import * as Styled from "./styles";

function SearchResultsTypeGeneric(props) {
  const {
    figure,
    url,
    parent,
    parentUrl,
    hideParent,
    title,
    attribution,
    description,
    label,
    collectable,
    excerpts,
    meta
  } = props;

  const { t } = useTranslation();

  const maybeWithLink = ({ to, children, tabIndex = 0, ariaHidden = null }) => {
    return to ? (
      <Styled.Link to={to} tabIndex={tabIndex} aria-hidden={ariaHidden}>
        {children}
      </Styled.Link>
    ) : (
      children
    );
  };

  return (
    <Styled.Result>
      <Styled.Inner>
        <Styled.ImageCol>
          {figure &&
            maybeWithLink({
              to: url,
              children: (
                <Styled.Image {...maybeHtml(figure)}>
                  {maybeReactNode(figure)}
                </Styled.Image>
              ),
              tabIndex: -1,
              ariaHidden: true
            })}
        </Styled.ImageCol>
        <Styled.TextCol>
          <Styled.TextTop>
            <Styled.TextTopLeft>
              {parent &&
                !hideParent &&
                maybeWithLink({
                  to: parentUrl,
                  children: (
                    <Styled.Parent {...maybeHtml(parent)}>
                      {maybeReactNode(parent)}
                    </Styled.Parent>
                  )
                })}
              {title &&
                maybeWithLink({
                  to: url,
                  children: (
                    <Styled.Title {...maybeHtml(title)}>
                      {maybeReactNode(title)}
                    </Styled.Title>
                  )
                })}
              {attribution && (
                <Styled.Attribution>
                  <span {...maybeHtml(attribution)}>
                    {maybeReactNode(attribution) && (
                      <>
                        <em>{t("common.by")}</em> {maybeReactNode(attribution)}
                      </>
                    )}
                  </span>
                </Styled.Attribution>
              )}
            </Styled.TextTopLeft>
            <Styled.TextTopRight>
              <Styled.Label>{label}</Styled.Label>
              {collectable && (
                <Styled.ToggleWrapper>
                  <Collecting.Toggle collectable={collectable} />
                </Styled.ToggleWrapper>
              )}
            </Styled.TextTopRight>
          </Styled.TextTop>
          {description && (
            <Styled.Description {...maybeHtml(description)}>
              {maybeReactNode(description)}
            </Styled.Description>
          )}
          {excerpts && (
            <Collapse>
              <Excerpts excerpts={excerpts} />
            </Collapse>
          )}
          {meta && (
            <Styled.Meta {...maybeHtml(meta)}>
              {maybeReactNode(meta)}
            </Styled.Meta>
          )}
        </Styled.TextCol>
      </Styled.Inner>
    </Styled.Result>
  );
}

SearchResultsTypeGeneric.displayName = "Search.Results.Type.Generic";

export default withSearchResultHelper(SearchResultsTypeGeneric);
