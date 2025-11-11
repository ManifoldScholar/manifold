import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function ChildNavigation({
  ariaLabel,
  links,
  layout = "grid",
  padLinks
}) {
  const location = useLocation();

  return (
    <Styled.ChildNav
      aria-label={ariaLabel}
      $layout={layout}
      $count={links.length}
    >
      {links.map(({ to, exact, isActive, text, icon }) => {
        const customActive =
          typeof isActive === "function" ? isActive(location) : false;
        return (
          <Styled.Link
            key={text}
            to={to}
            end={exact}
            $padded={padLinks}
            className={customActive ? "active" : undefined}
          >
            {icon && <IconComposer icon={icon} size="default" />}
            <Styled.LinkText>{text}</Styled.LinkText>
          </Styled.Link>
        );
      })}
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
