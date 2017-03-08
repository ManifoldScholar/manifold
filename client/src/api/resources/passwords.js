export default {

  create(email) {
    return {
      endpoint: `/api/v1/passwords`,
      method: 'POST',
      options: {
        params: { email }
      }
    };
  },

  update(password, passwordConfirmation, resetToken) {
    return {
      endpoint: `/api/v1/passwords/update`,
      method: 'PUT',
      options: {
        params: {
          password,
          password_confirmation: passwordConfirmation,
          reset_token: resetToken
        }
      }
    };
  }

};
