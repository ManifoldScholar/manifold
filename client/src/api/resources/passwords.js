export default {
  create(email) {
    return {
      endpoint: `/api/v1/passwords`,
      method: "POST",
      options: {
        params: { email }
      }
    };
  },

  update(password, passwordConfirmation, resetToken) {
    return {
      endpoint: `/api/v1/passwords/update`,
      method: "PUT",
      options: {
        params: {
          password,
          password_confirmation: passwordConfirmation,
          reset_token: resetToken
        }
      }
    };
  },

  admin_reset_password(id) {
    return {
      endpoint: `/api/v1/passwords/admin_reset_password`,
      method: "POST",
      options: {
        params: { id }
      }
    };
  }
};
