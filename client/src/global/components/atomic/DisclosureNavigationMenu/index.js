import React from "react";
import PropTypes from "prop-types";
import useMenuState from "./hooks/useMenuState";

function DisclosureNavigationMenu({
  disclosure,
  visible: initialVisible,
  onBlur,
  children,
  ...props
}) {
  const { disclosureProps, contentProps } = useMenuState(
    initialVisible,
    onBlur
  );
  return (
    <>
      {React.cloneElement(disclosure, {
        ...disclosureProps,
        ...props
      })}
      {React.Children.only(
        React.cloneElement(children, { ...contentProps, ...props })
      )}
    </>
  );
}

DisclosureNavigationMenu.displayName = "Global.Atomic.DisclosureNavigationMenu";

DisclosureNavigationMenu.propTypes = {
  disclosure: PropTypes.node.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  visible: PropTypes.bool
};

export default DisclosureNavigationMenu;
