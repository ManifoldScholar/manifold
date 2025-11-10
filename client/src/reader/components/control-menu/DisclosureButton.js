import { forwardRef } from "react";
import classNames from "classnames";
import Utility from "global/components/utility";

const ControlMenuDisclosureButton = (props, ref) => {
  const { label, visible, icon, ...rest } = props;

  const buttonClass = classNames({
    "reader-header__button": true,
    "reader-header__button--pad-narrow": true,
    "button-active": visible
  });

  return (
    <button
      ref={ref}
      className={buttonClass}
      data-id={`toggle-${label}`}
      aria-expanded={visible}
      {...rest}
    >
      <Utility.IconComposer icon={icon} size={32} />
      <span className="screen-reader-text">{label}</span>
    </button>
  );
};

ControlMenuDisclosureButton.displayName = "ControlMenu.Button";

export default forwardRef(ControlMenuDisclosureButton);
