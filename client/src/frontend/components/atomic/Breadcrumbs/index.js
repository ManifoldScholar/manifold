import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function Breadcrumbs({ breadcrumbs, secondary = false }) {
  const OuterComponent = secondary ? Styled.OuterSecondary : Styled.Outer;
  const InnerComponent = secondary ? Styled.InnerSecondary : Styled.Inner;
  const icon = secondary ? "circleArrowLeft64" : "arrowLeft16";
  const iconSize = secondary ? 56 : 24;

  return (
    <OuterComponent className="bg-neutral05">
      <InnerComponent>
        <IconComposer icon={icon} size={iconSize} />
        {breadcrumbs.map(crumb => (
          <Styled.Breadcrumb to={crumb.to} key={crumb.to}>
            {crumb.label}
          </Styled.Breadcrumb>
        ))}
      </InnerComponent>
    </OuterComponent>
  );
}

Breadcrumbs.displayName = "Frontend.Atomic.Breadcrumbs";

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.object.isRequired,
  secondary: PropTypes.bool
};
