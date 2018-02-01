import { Children, PureComponent } from "react";
import PropTypes from "prop-types";

export default class RequireAbility extends PureComponent {
  static propTypes = {
    entity: PropTypes.object,
    requiredAbility: PropTypes.string.isRequired,
    hasAbilityBehavior: PropTypes.oneOf(["hide", "show"]).isRequired,
    redirect: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  };

  static defaultProps = {
    hasAbilityBehavior: "show"
  };

  hasAbility(props) {
    const abilities = this.abilities(props);
    const ability = props.requiredAbility;
    if (!abilities) return false;
    if (!abilities[ability]) return false;
    return abilities[ability];
  }

  abilities(props) {
    return props.entity.attributes.abilities;
  }

  behavior(props) {
    return props.hasAbilityBehavior;
  }

  renderHide(props) {
    if (!this.hasAbility(props)) return Children.only(this.props.children);
    return null;
  }

  renderShow(props) {
    if (this.hasAbility(props)) return Children.only(this.props.children);
    return null;
  }

  render() {
    if (!this.props.children) return false;
    const behavior = this.behavior(this.props);
    if (behavior === "hide") return this.renderHide(this.props);
    if (behavior === "show") return this.renderShow(this.props);
    return null;
  }
}
