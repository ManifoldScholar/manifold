import memoize from "lodash/memoize";

// Labels reference i18n keys in /shared/page-titles.json.

class Navigation {
  static frontend(authentication, settings) {
    if (settings.attributes.general.libraryDisabled) return [];

    const hideRGs =
      settings.attributes.general.disableReadingGroups ||
      (!authentication.currentUser &&
        settings.attributes.general.disablePublicReadingGroups);

    return [
      {
        label: "titles.home",
        path: "/",
        matchType: "link"
      },
      {
        label: "titles.projects",
        path: "/projects",
        dropdown: true,
        children: [
          {
            label: "titles.projects_all",
            path: "/projects"
          },
          settings.attributes.calculated?.hasProjectCollections && {
            label: "titles.project_collections",
            path: "/project-collections"
          }
        ]
      },
      settings.attributes.calculated.hasVisibleJournals && {
        label: "titles.journals",
        path: "/journals",
        children: [
          {
            label: "titles.journals_all",
            path: "/journals"
          },
          {
            label: "titles.issues_all",
            path: "/journals/issues"
          }
        ]
      },
      !hideRGs && {
        label: "titles.groups",
        path: "/groups"
      }
    ].filter(x => x);
  }

  static backend = memoize(() => {
    return [
      {
        label: "titles.dashboard",
        path: "/backend/dashboard"
      },
      {
        label: "titles.projects",
        path: "/backend/projects",
        dropdown: true,
        children: [
          {
            label: "titles.projects_all",
            path: "/backend/projects/all"
          },
          {
            label: "titles.project_collections",
            path: "/backend/projects/project-collections",
            entity: "projectCollection",
            ability: "update"
          }
        ]
      },
      {
        label: "titles.projects",
        path: "/backend/projects/all"
      },
      {
        label: "titles.journals",
        path: "/backend/journals"
      },
      {
        label: "titles.groups",
        path: "/backend/groups",
        entity: "readingGroup",
        kind: "admin"
      },
      {
        label: "titles.records",
        path: "/backend/records",
        entity: ["user", "maker", "page", "feature"],
        ability: "update",
        children: [
          {
            label: "titles.makers",
            path: "/backend/records/makers",
            entity: "maker",
            ability: "update"
          },
          {
            label: "titles.users",
            path: "/backend/records/users",
            entity: "user",
            ability: "update"
          },
          {
            label: "titles.pages",
            path: "/backend/records/pages",
            entity: "page",
            ability: "update"
          },
          {
            label: "titles.features",
            path: "/backend/records/features",
            entity: "feature",
            ability: "update"
          },
          {
            label: "titles.entitlements",
            path: "/backend/records/entitlements",
            entity: "entitlement",
            ability: "update"
          },
          {
            label: "titles.annotations",
            path: "/backend/records/annotations",
            entity: "annotation",
            ability: "update"
          },
          {
            label: "titles.comments",
            path: "/backend/records/comments",
            entity: "comment",
            ability: "update"
          }
        ]
      },
      {
        label: "titles.settings",
        path: "/backend/settings",
        entity: "settings",
        ability: "update",
        children: [
          {
            label: "titles.properties",
            path: "/backend/settings/properties"
          },
          {
            label: "titles.theme",
            path: "/backend/settings/theme"
          },
          {
            label: "titles.content",
            path: "/backend/settings/content"
          },
          {
            label: "titles.ingestion",
            path: "/backend/settings/ingestion"
          },
          {
            label: "titles.integrations",
            path: "/backend/settings/integrations"
          },
          {
            label: "titles.subjects",
            path: "/backend/settings/subjects"
          },
          {
            label: "titles.email",
            path: "/backend/settings/email"
          },
          {
            label: "titles.export_targets",
            path: "/backend/settings/export-targets",
            entity: "exportTarget",
            ability: "update"
          }
        ]
      },
      {
        label: "titles.analytics",
        path: "/backend/analytics",
        entity: "statistics",
        ability: "read",
        children: []
      }
    ];
  });

  static resourceCollection(collection) {
    return [
      {
        label: "titles.properties",
        path: id => `/backend/projects/resource-collection/${id}/properties`,
        entity: collection,
        ability: "update",
        id: collection.id
      },
      {
        label: "titles.resources",
        path: id => `/backend/projects/resource-collection/${id}/resources`,
        entity: collection,
        ability: "update",
        id: collection.id
      }
    ];
  }

  static page = memoize(page => {
    return [
      {
        label: "titles.properties",
        path: id => `/backend/records/pages/${id}/properties`,
        entity: page,
        ability: "update",
        id: page.id
      }
    ];
  });

  static project = memoize(project => {
    return [
      {
        label: "titles.analytics",
        path: id => `/backend/projects/${id}/analytics`,
        entity: project,
        ability: "update",
        id: project.id
      },
      {
        label: "titles.properties",
        path: id => `/backend/projects/${id}/properties`,
        entity: project,
        ability: "update",
        id: project.id
      },
      {
        label: "titles.layout",
        path: id => `/backend/projects/${id}/layout`,
        entity: project,
        ability: "update",
        id: project.id
      },
      {
        label: "titles.access",
        path: id => `/backend/projects/${id}/access`,
        entity: project,
        ability: "update",
        id: project.id
      },
      {
        label: "titles.collaborators",
        path: id => `/backend/projects/${id}/collaborators`,
        entity: project,
        ability: "updateMakers",
        id: project.id
      },
      {
        label: "titles.texts",
        path: id => `/backend/projects/${id}/texts`,
        entity: project,
        ability: "manageTexts",
        id: project.id
      },
      {
        label: "titles.resources",
        path: id => `/backend/projects/${id}/resources`,
        entity: project,
        ability: "manageResources",
        id: project.id
      },
      {
        label: "titles.resource_collections",
        path: id => `/backend/projects/${id}/resource-collections`,
        entity: project,
        ability: "manageResourceCollections",
        id: project.id
      },
      {
        label: "titles.events",
        path: id => `/backend/projects/${id}/events`,
        entity: project,
        ability: "manageEvents",
        id: project.id
      },
      {
        label: "titles.metadata",
        path: id => `/backend/projects/${id}/metadata`,
        entity: project,
        ability: "update",
        id: project.id
      },
      {
        label: "titles.exports",
        path: id => `/backend/projects/${id}/exports`,
        entity: project,
        ability: "manageProjectExportations",
        id: project.id
      },
      {
        label: "titles.log",
        path: id => `/backend/projects/${id}/log`,
        entity: project,
        ability: "readLog",
        id: project.id
      }
    ];
  });

  static projects = memoize(() => {
    return [
      {
        label: "titles.projects_all",
        path: "/backend/projects/all",
        entity: "project",
        ability: "update"
      },
      {
        label: "titles.project_collections",
        path: "/backend/projects/project-collections",
        entity: "projectCollection",
        ability: "update"
      }
    ];
  });

  static journal = memoize(journal => {
    return [
      {
        label: "titles.properties",
        path: id => `/backend/journals/${id}/properties`,
        entity: journal,
        ability: "update",
        id: journal.id
      },
      {
        label: "titles.layout",
        path: id => `/backend/journals/${id}/layout`,
        entity: journal,
        ability: "update",
        id: journal.id
      },
      {
        label: "titles.access",
        path: id => `/backend/journals/${id}/access`,
        entity: journal,
        ability: "update",
        id: journal.id
      },
      {
        label: "titles.metadata",
        path: id => `/backend/journals/${id}/metadata`,
        entity: journal,
        ability: "update",
        id: journal.id
      },
      {
        label: "titles.issues",
        path: id => `/backend/journals/${id}/issues`,
        entity: journal,
        ability: "read",
        id: journal.id
      },
      {
        label: "titles.volumes",
        path: id => `/backend/journals/${id}/volumes`,
        entity: journal,
        ability: "update",
        id: journal.id
      }
    ];
  });

  static readingGroup = memoize(group => {
    return [
      {
        label: "titles.details",
        path: id => `/backend/groups/${id}/details`,
        entity: group,
        ability: "read",
        id: group.id
      },
      {
        label: "titles.members",
        path: id => `/backend/groups/${id}/members`,
        entity: group,
        ability: "update",
        id: group.id
      },
      {
        label: "titles.annotations",
        path: id => `/backend/groups/${id}/annotations`,
        entity: group,
        ability: "update",
        id: group.id
      }
    ];
  });

  static records = memoize(() => {
    return [
      {
        label: "titles.makers",
        path: "/backend/records/makers",
        entity: "maker",
        ability: "update"
      },
      {
        label: "titles.users",
        path: "/backend/records/users",
        entity: "user",
        ability: "update"
      },
      {
        label: "titles.pages",
        path: "/backend/records/pages",
        entity: "page",
        ability: "update"
      },
      {
        label: "titles.features",
        path: "/backend/records/features",
        entity: "feature",
        ability: "update"
      },
      {
        label: "Entitlements",
        path: "/backend/records/entitlements",
        entity: "entitlementImport",
        ability: "update"
      },
      {
        label: "titles.annotations",
        path: "/backend/records/annotations",
        entity: "annotation",
        kind: "admin"
      },
      {
        label: "titles.comments",
        path: "/backend/records/comments",
        entity: "comment",
        kind: "admin"
      }
    ];
  });

  static user = memoize(user => {
    return [
      {
        label: "titles.properties",
        path: id => `/backend/records/users/${id}/properties`,
        entity: user,
        ability: "update",
        id: user.id
      },
      {
        label: "titles.activity",
        path: id => `/backend/records/users/${id}/activity`,
        entity: user,
        ability: "update",
        id: user.id
      }
    ];
  });

  static resource = memoize(resource => {
    const externalVideo = !!resource.attributes.externalId;
    const project = resource.relationships.project;
    const kind = resource.attributes.kind;
    const out = [
      {
        label: "titles.properties",
        path: id => `/backend/projects/resource/${id}/properties`,
        entity: project,
        ability: "update",
        id: resource.id
      },
      {
        label: "titles.metadata",
        path: id => `/backend/projects/resource/${id}/metadata`,
        entity: project,
        ability: "manageResources",
        id: resource.id
      }
    ];
    if (
      kind === "image" ||
      kind === "audio" ||
      kind === "interactive" ||
      (kind === "video" && !externalVideo)
    ) {
      out.splice(1, 0, {
        label: "titles.variants",
        path: id => `/backend/projects/resource/${id}/variants`,
        entity: project,
        ability: "update",
        id: resource.id
      });
    }
    if (kind === "audio" || (kind === "video" && !externalVideo)) {
      out.push({
        label: "titles.tracks",
        path: id => `/backend/projects/resource/${id}/tracks`,
        entity: project,
        ability: "update",
        id: resource.id
      });
    }
    return out;
  });

  static settings = memoize(() => {
    return [
      {
        label: "titles.properties",
        path: "/backend/settings/properties",
        entity: "settings",
        ability: "update"
      },
      {
        label: "titles.theme",
        path: "/backend/settings/theme",
        entity: "settings",
        ability: "update"
      },
      {
        label: "titles.content",
        path: "/backend/settings/content",
        entity: "settings",
        ability: "update"
      },
      {
        label: "titles.integrations",
        path: "/backend/settings/integrations",
        entity: "settings",
        ability: "update"
      },
      {
        label: "titles.ingestion",
        path: "/backend/settings/ingestion",
        entity: "settings",
        ability: "update"
      },
      {
        label: "titles.subjects",
        path: "/backend/settings/subjects",
        entity: "settings",
        ability: "update"
      },
      {
        label: "titles.email",
        path: "/backend/settings/email",
        entity: "settings",
        ability: "update"
      },
      {
        label: "titles.export_targets",
        path: "/backend/settings/export-targets",
        entity: "exportTarget",
        ability: "update"
      }
    ];
  });

  static text = memoize(text => {
    return [
      {
        label: "titles.analytics",
        path: id => `/backend/projects/text/${id}/analytics`,
        entity: text,
        ability: "update",
        id: text.id
      },
      {
        label: "titles.properties",
        path: id => `/backend/projects/text/${id}/properties`,
        entity: text,
        ability: "update",
        id: text.id
      },
      {
        label: "titles.collaborators",
        path: id => `/backend/projects/text/${id}/collaborators`,
        entity: text.relationships.project,
        ability: "updateMakers",
        id: text.id
      },
      {
        label: "titles.sections",
        path: id => `/backend/projects/text/${id}/sections`,
        entity: text,
        ability: "update",
        id: text.id
      },
      {
        label: "titles.toc",
        path: id => `/backend/projects/text/${id}/contents`,
        entity: text,
        ability: "update",
        id: text.id
      },
      {
        label: "titles.assets",
        path: id => `/backend/projects/text/${id}/assets`,
        entity: text,
        ability: "update",
        id: text.id
      },
      {
        label: "titles.metadata",
        path: id => `/backend/projects/text/${id}/metadata`,
        entity: text,
        ability: "update",
        id: text.id
      },
      {
        label: "titles.styles",
        path: id => `/backend/projects/text/${id}/styles`,
        entity: text,
        ability: "update",
        id: text.id
      },
      {
        label: "titles.reingest",
        path: id => `/backend/projects/text/${id}/ingestions/new`,
        entity: text,
        ability: "update",
        id: text.id
      }
    ];
  });
}

export default Navigation;
