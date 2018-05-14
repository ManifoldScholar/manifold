export default {
  create(contactForm) {
    return {
      endpoint: `/api/v1/contacts`,
      method: "POST",
      options: {
        body: JSON.stringify({ type: "contacts", data: contactForm })
      }
    };
  }
};
