import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import { ClassNames } from "@emotion/react";
import * as Styled from "./styles";

function ChildNavigation({ ariaLabel, links, layout = "grid", padLinks }) {
  return (
    <Styled.ChildNav
      aria-label={ariaLabel}
      $layout={layout}
      $count={links.length}
    >
      {links.map(({ to, exact, isActive, text, icon }) => (
        <ClassNames key={text}>
          {({ css }) => (
            <Styled.Link
              to={to}
              exact={exact}
              isActive={isActive}
              $padded={padLinks}
              activeClassName={css(
                `--box-bg-color: var(--color-base-neutral10); color: var(--strong-color);`
              )}
            >
              {icon && <IconComposer icon={icon} size="default" />}
              <Styled.LinkText>{text}</Styled.LinkText>
            </Styled.Link>
          )}
        </ClassNames>
      ))}
    </Styled.ChildNav>
  );
}

ChildNavigation.displayName = "ReadingGroup.Heading.ChildNavigation";

ChildNavigation.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      icon: PropTypes.string,
      exact: PropTypes.bool,
      isActive: PropTypes.func
    }).isRequired
  ).isRequired,
  layout: PropTypes.oneOf(["flex", "grid"]),
  padLinks: PropTypes.bool
};

export default ChildNavigation;
