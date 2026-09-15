export default {
  create(email) {
    return {
      endpoint: `/api/v1/passwords`,
      method: "POST",
      options: {
        body: JSON.stringify({ email })
      }
    };
  },

  update(password, passwordConfirmation, resetToken) {
    return {
      endpoint: `/api/v1/passwords/update`,
      method: "PUT",
      options: {
        body: JSON.stringify({
          password,
          password_confirmation: passwordConfirmation,
          reset_token: resetToken
        })
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
