import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";
import isString from "lodash/isString";
import get from "lodash/get";

class Authorization {
  isAuthenticated(options) {
    return get(options, "authentication.authenticated");
  }

  currentUser(options) {
    if (options.hasOwnProperty("currentUser")) return options.currentUser;
    return get(options, "authentication.currentUser");
  }

  authorize(options) {
    let authorized = null;
    if (options.kind) authorized = this.authorizeKind(options);
    if (authorized === false) return false;
    if (options.ability) authorized = this.authorizeAbility(options);
    if (authorized === null) authorized = false;
    return authorized;
  }

  authorizeKind(options) {
    if (options.kind === "none") return true;
    const authenticated = this.isAuthenticated(options);
    const currentUser = this.currentUser(options);
    if (options.kind === "unauthenticated" && !authenticated) return true;
    if (!authenticated) return false;
    if (options.kind === "any" && authenticated) return true;
    if (Array.isArray(options.kind))
      return options.kind.includes(currentUser.attributes.kind);
    return options.kind === currentUser.attributes.kind;
  }

  authorizeAbility(options) {
    // For simplicity, always assume we're authorizing an ability against multiple
    // entities. If the user has <ability> for any entity in <entities> then auth
    // passes.
    const entities = this.normalizeEntityToArray(options);
    const abilities = this.normalizeAbilityToArray(options);
    const classAbilities = this.classAbilities(options);
    return this.checkAbilitiesForEntities(entities, abilities, classAbilities);
  }

  normalizeEntityToArray(options) {
    if (isArray(options.entity)) return options.entity;
    return [options.entity];
  }

  normalizeAbilityToArray(options) {
    if (isArray(options.ability)) return options.ability;
    return [options.ability];
  }

  classAbilities(options) {
    const currentUser = this.currentUser(options);
    if (!currentUser || !currentUser.attributes) return {};
    return currentUser.attributes.classAbilities || {};
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
}

export default Authorization;
