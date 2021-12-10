import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function Breadcrumbs({ breadcrumbs }) {
  return (
    <Styled.Outer className="bg-neutral05" aria-label="Breadcrumb">
      <Styled.Inner>
        {breadcrumbs.length === 1 &&
          breadcrumbs.map(crumb => (
            <Styled.Breadcrumb to={crumb.to} key={crumb.to}>
              <IconComposer icon="arrowLeft16" size={24} />
              <Styled.Label>{crumb.label}</Styled.Label>
            </Styled.Breadcrumb>
          ))}
        {breadcrumbs.length > 1 && (
          <>
            <IconComposer icon="arrowLeft16" size={24} />
            {breadcrumbs.map((crumb, i) => (
              <Styled.Breadcrumb
                to={crumb.to}
                key={crumb.to}
                aria-current={i === breadcrumbs.length - 1 ? "page" : null}
              >
                <Styled.Label>{crumb.label}</Styled.Label>
              </Styled.Breadcrumb>
            ))}
          </>
        )}
      </Styled.Inner>
    </Styled.Outer>
  );
}

Breadcrumbs.displayName = "Frontend.Atomic.Breadcrumbs";

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.object.isRequired
};
