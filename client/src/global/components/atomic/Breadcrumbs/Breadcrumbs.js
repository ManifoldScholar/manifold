import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function Breadcrumbs({
  breadcrumbs,
  backend = false,
  hideOnDesktop = false
}) {
  const { t } = useTranslation();

  const Wrapper = backend ? Styled.BackendOuter : Styled.Outer;
  const Inner = backend ? Styled.BackendInner : Styled.Inner;
  const Icon = backend ? Styled.Icon : IconComposer;

  return (
    <Wrapper
      aria-label={t("navigation.breadcrumbs.aria_label")}
      $hideOnDesktop={hideOnDesktop}
    >
      <Inner>
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
            {i === 0 && (
              <>
                <Icon icon="arrowLeft16" size={backend ? "default" : 24} />
                {backend && <Icon icon="arrowLeft32" size="default" $desktop />}
              </>
            )}
            <Styled.Label>{crumb.label}</Styled.Label>
          </Styled.Breadcrumb>
        ))}
      </Inner>
    </Wrapper>
  );
}

Breadcrumbs.displayName = "Global.Atomic.Breadcrumbs";

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.array.isRequired,
  backend: PropTypes.bool,
  hideOnDesktop: PropTypes.bool
};
