import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import isString from "lodash/isString";
import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";
import { Redirect } from "react-router-dom";
import { notificationActions } from "actions";

export class AuthorizeComponent extends PureComponent {
  static mapStateToProps = state => {
    return {
      authentication: state.authentication
    };
  };

  static propTypes = {
    entity: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.array
    ]),
    ability: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    kind: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    successBehavior: PropTypes.oneOf(["hide", "show"]).isRequired,
    failureRedirect: PropTypes.string,
    failureNotification: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ]),
    failureFatalError: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    authentication: PropTypes.object
  };

  static defaultProps = {
    successBehavior: "show",
    failureRedirect: null,
    failureNotification: null,
    failureFatalError: null
  };

  constructor() {
    super();
    this.state = { redirect: false };
  }

  componentDidMount() {
    this.maybeError(this.props);
    this.maybeNotify(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.maybeRedirect(nextProps)) this.setState({ redirect: true });
  }

  maybeRedirect(props) {
    if (!isString(props.failureRedirect)) return false;
    if (props.failureFatalError) return false;
    return !this.authorize(props);
  }

  isAuthenticated(props) {
    return props.authentication.authenticated;
  }

  currentUser(props) {
    return props.authentication.currentUser;
  }

  successBehavior(props) {
    return props.successBehavior;
  }

  maybeError(props) {
    if (!!props.failureFatalError && !this.authorize(props)) {
      let error = {
        title: "Access Denied.",
        detail: "You do not have sufficient permissions to perform this action."
      };
      if (isPlainObject(props.failureFatalError)) {
        error = Object.assign(error, props.failureFatalError);
      }
      props.dispatch(notificationActions.fatalError(error));
    }
  }

  maybeNotify(props) {
    if (!!props.failureNotification && !this.authorize(props)) {
      let error = {
        heading: "Access Denied.",
        body: "You do not have sufficient permissions to perform this action.",
        level: 2
      };
      if (isPlainObject(props.failureNotification)) {
        error = Object.assign(error, props.failureNotification);
      }
      props.dispatch(notificationActions.addNotification(error));
    }
  }

  authorize(props) {
    let authorized = null;
    if (props.kind) authorized = this.authorizeKind(props);
    if (authorized === false) return false;
    if (props.ability) authorized = this.authorizeAbility(props);
    if (authorized === null) authorized = false;
    return authorized;
  }

  authorizeKind(props) {
    if (props.kind === "none") return true;
    if (props.kind === "unauthenticated" && !this.isAuthenticated(props))
      return true;
    if (!this.isAuthenticated(props)) return false;
    if (props.kind === "any" && this.isAuthenticated(props)) return true;
    const currentUser = this.currentUser(props);
    if (Array.isArray(props.kind))
      return props.kind.includes(currentUser.attributes.kind);
    return props.kind === currentUser.attributes.kind;
  }

  normalizeEntityToArray(props) {
    if (isArray(props.entity)) return props.entity;
    return [props.entity];
  }

  normalizeAbilityToArray(props) {
    if (isArray(props.ability)) return props.ability;
    return [props.ability];
  }

  classAbilities(props) {
    const currentUser = this.currentUser(props);
    if (!currentUser || !currentUser.attributes) return {};
    return currentUser.attributes.classAbilities || {};
  }

  authorizeAbility(props) {
    // For simplicity, always assume we're authorizing an ability against multiple
    // entities. If the user has <ability> for any entity in <entities> then auth
    // passes.
    const entities = this.normalizeEntityToArray(props);
    const abilities = this.normalizeAbilityToArray(props);
    const classAbilities = this.classAbilities(props);
    return this.checkAbilitiesForEntities(entities, abilities, classAbilities);
  }

  checkAbilitiesForEntities(entities, abilities, classAbilities) {
    const found = entities.find(entity => {
      return this.checkAbilitiesForEntity(entity, abilities, classAbilities);
    });
    return found !== undefined;
  }

  checkAbilitiesForEntity(entity, abilities, classAbilities) {
    if (isString(entity))
      return this.checkAbilitiesForEntityType(
        entity,
        abilities,
        classAbilities
      );
    if (isPlainObject(entity))
      return this.checkAbilitiesForEntityInstance(entity, abilities);
    return false;
  }

  checkAbilitiesForEntityType(entityType, abilities, classAbilities) {
    // If we're checking multiple abilities, only one needs to exist.
    const match = abilities.find(ability => {
      return this.checkAbilityForEntityType(
        entityType,
        ability,
        classAbilities
      );
    });
    return match !== undefined;
  }

  checkAbilityForEntityType(entity, ability, classAbilities) {
    if (!classAbilities[entity]) return false;
    if (!classAbilities[entity][ability]) return false;
    return classAbilities[entity][ability];
  }

  checkAbilitiesForEntityInstance(entity, abilities) {
    // If we're checking multiple abilities, only one needs to exist.
    const match = abilities.find(ability => {
      return this.checkAbilityForEntityInstance(entity, ability);
    });
    return match !== undefined;
  }

  checkAbilityForEntityInstance(entity, ability) {
    if (!entity || !entity.attributes || !entity.attributes.abilities)
      return false;
    if (!entity.attributes.abilities[ability]) return false;
    return entity.attributes.abilities[ability];
  }

  renderHide(props) {
    if (this.authorize(props)) return null;
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }

  renderShow(props) {
    if (!this.authorize(props)) return null;
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }

  render() {
    if (this.state.redirect)
      return <Redirect to={this.props.failureRedirect} />;
    if (!this.props.children) return false;
    const successBehavior = this.successBehavior(this.props);
    if (successBehavior === "hide") return this.renderHide(this.props);
    if (successBehavior === "show") return this.renderShow(this.props);
    return null;
  }
}

export default connect(AuthorizeComponent.mapStateToProps)(AuthorizeComponent);
