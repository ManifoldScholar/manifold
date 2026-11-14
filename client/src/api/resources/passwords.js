export default {
  create(email, accountLinkToken) {
    return {
      endpoint: `/api/v1/passwords`,
      method: "POST",
      options: {
        body: JSON.stringify({ email, account_link_token: accountLinkToken })
      }
    };
  },

  update(password, passwordConfirmation, resetToken, accountLinkToken) {
    return {
      endpoint: `/api/v1/passwords/update`,
      method: "PUT",
      options: {
        body: JSON.stringify({
          password,
          password_confirmation: passwordConfirmation,
          reset_token: resetToken,
          account_link_token: accountLinkToken
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
