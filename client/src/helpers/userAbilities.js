class UserAbilities {
  constructor(user) {
    this.user = user;
  }

  hasClassAbility(className, ability) {
    if (!this.user) return false;
    if (!this.user.attributes.classAbilities[className]) return false;
    return this.user.attributes.classAbilities[className][ability];
  }
}

export default UserAbilities;
