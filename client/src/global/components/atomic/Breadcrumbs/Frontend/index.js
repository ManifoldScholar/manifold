import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import { maybeHtml, maybeReactNode } from "helpers/maybeHtml";
import * as Styled from "./styles";

export default function FrontendBreadcrumbs({
  breadcrumbs,
  hideOnDesktop = false
}) {
  const { t } = useTranslation();

  return (
    <Styled.Outer
      aria-label={t("navigation.breadcrumbs.aria_label")}
      $hideOnDesktop={hideOnDesktop}
    >
      <Styled.Inner>
        {breadcrumbs.map((crumb, i) => (
          <Styled.Breadcrumb
            to={crumb.to}
            key={crumb.to}
            aria-current={
              breadcrumbs.length > 1 && i === breadcrumbs.length - 1
                ? "page"
                : null
            }
          >
            {i === 0 && <IconComposer icon="arrowLeft16" size={24} />}
            <Styled.Label {...maybeHtml(crumb.label)}>
              {maybeReactNode(crumb.label)}
            </Styled.Label>
          </Styled.Breadcrumb>
        ))}
      </Styled.Inner>
    </Styled.Outer>
  );
}

FrontendBreadcrumbs.displayName = "Global.Atomic.Breadcrumbs.Frontend";

FrontendBreadcrumbs.propTypes = {
  breadcrumbs: PropTypes.array.isRequired,
  backend: PropTypes.bool,
  hideOnDesktop: PropTypes.bool
};
