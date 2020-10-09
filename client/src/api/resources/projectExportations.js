export default {
  create(exportTarget) {
    return {
      endpoint: "/api/v1/project_exportations",
      method: "POST",
      options: {
        body: JSON.stringify({
          type: "projectExportations",
          data: exportTarget
        })
      }
    };
  },

  destroy(id) {
    return {
      endpoint: `/api/v1/project_exportations/${id}`,
      method: "DELETE",
      options: {}
    };
  }
};
