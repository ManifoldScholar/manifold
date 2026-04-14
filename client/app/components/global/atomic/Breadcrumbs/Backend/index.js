import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { maybeHtml, maybeReactNode } from "helpers/maybeHtml";
import * as Styled from "./styles";

export default function BackendBreadcrumbs({
  breadcrumbs,
  hideOnDesktop = false
}) {
  const { t } = useTranslation();

  /* eslint-disable react/no-array-index-key */
  return (
    <Styled.BackendOuter
      aria-label={t("navigation.breadcrumbs.aria_label")}
      $hideOnDesktop={hideOnDesktop}
    >
      <Styled.BackendInner>
        {breadcrumbs.map((crumb, i) => {
          const maybeLinkProps = crumb.to
            ? { to: crumb.to }
            : { as: "span", $noLink: true };
          return (
            <Fragment key={`${i}_${crumb.to}`}>
              <Styled.BackendBreadcrumb
                {...maybeLinkProps}
                aria-current={
                  breadcrumbs.length > 1 && i === breadcrumbs.length - 1
                    ? "page"
                    : null
                }
              >
                <Styled.Label {...maybeHtml(crumb.label)}>
                  {maybeReactNode(crumb.label)}
                </Styled.Label>
              </Styled.BackendBreadcrumb>
              {i < breadcrumbs.length - 1 && (
                <Styled.Spacer icon="disclosureDown16" size={16} />
              )}
            </Fragment>
          );
        })}
      </Styled.BackendInner>
    </Styled.BackendOuter>
  );
}

BackendBreadcrumbs.displayName = "Global.Atomic.Breadcrumbs.Backend";

BackendBreadcrumbs.propTypes = {
  breadcrumbs: PropTypes.array.isRequired,
  hideOnDesktop: PropTypes.bool
};
