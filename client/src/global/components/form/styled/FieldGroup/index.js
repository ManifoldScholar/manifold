import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isString from "lodash/isString";
import { UIDConsumer } from "react-uid";
import SectionLabel from "../SectionLabel";
import Instructions from "../Instructions";
import { FormContext } from "helpers/contexts";
import * as Styled from "./styles";

export default class FieldGroup extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    horizontal: PropTypes.bool,
    wide: PropTypes.bool,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    label: PropTypes.string,
    labelTag: PropTypes.oneOf(["h2", "span"]),
    theme: PropTypes.oneOf(["primary", "secondary"])
  };

  static defaultProps = {
    disabled: false,
    horizontal: false,
    wide: false,
    instructions: null,
    labelTag: "h2",
    theme: "primary"
  };

  static contextType = FormContext;

  get labelTag() {
    return this.props.labelTag;
  }

  renderChildren(props) {
    return React.Children.map(props.children, child => {
      if (!child) return null;
      if (isString(child.type)) {
        return child;
      }
      const {
        horizontal,
        wide,
        label,
        instructions,
        theme,
        children,
        ...childProps
      } = this.props;
      return React.cloneElement(child, childProps);
    });
  }

  render() {
    const GroupComponent =
      this.props.theme === "primary" ? Styled.BaseGroup : Styled.SecondaryGroup;

    return (
      <UIDConsumer name={id => `field-group-${id}`}>
        {id => (
          <Styled.Section
            key="group"
            role="group"
            aria-labelledby={`${id}-header`}
            aria-describedby={`${id}-instructions`}
            $horizontal={this.props.horizontal}
          >
            {isString(this.props.label) ? (
              <SectionLabel label={this.props.label} id={`${id}-header`} />
            ) : null}
            <Instructions
              id={`${id}-instructions`}
              instructions={this.props.instructions}
            />
            <GroupComponent>{this.renderChildren(this.props)}</GroupComponent>
          </Styled.Section>
        )}
      </UIDConsumer>
    );
  }
}
