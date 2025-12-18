import { Children, cloneElement } from "react";
import PropTypes from "prop-types";
import isString from "lodash/isString";
import { useId } from "react";
import SectionLabel from "../SectionLabel";
import Instructions from "../Instructions";
import * as Styled from "./styles";

const getAriaGroupAttributes = (id, label, instructions) => {
  if (!label && !instructions) return {};
  return {
    role: "group",
    "aria-labelledby": `${id}-header`,
    "aria-describedby": `${id}-instructions`
  };
};

export default function FieldGroup({
  horizontal = false,
  instructions = null,
  label,
  theme = "primary",
  className,
  children,
  ...restProps
}) {
  const id = useId();

  const renderChildren = () => {
    return Children.map(children, child => {
      if (!child) return null;
      if (isString(child.type)) {
        return child;
      }
      return cloneElement(child, restProps);
    });
  };

  const GroupComponent =
    theme === "secondary" ? Styled.SecondaryGroup : Styled.BaseGroup;

  const fieldGroupId = `field-group-${id}`;

  return (
    <Styled.Section
      key="group"
      {...getAriaGroupAttributes(fieldGroupId, label, instructions)}
      $horizontal={horizontal}
      className={className}
    >
      {isString(label) ? (
        <SectionLabel label={label} id={`${fieldGroupId}-header`} />
      ) : null}
      {instructions && (
        <Instructions
          id={`${fieldGroupId}-instructions`}
          instructions={instructions}
        />
      )}
      <GroupComponent>{renderChildren()}</GroupComponent>
    </Styled.Section>
  );
}

FieldGroup.propTypes = {
  disabled: PropTypes.bool,
  horizontal: PropTypes.bool,
  wide: PropTypes.bool,
  instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  label: PropTypes.string,
  labelTag: PropTypes.oneOf(["h2", "span"]),
  theme: PropTypes.oneOf(["primary", "secondary"]),
  className: PropTypes.string,
  children: PropTypes.node
};
