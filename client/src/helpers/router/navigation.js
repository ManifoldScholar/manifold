import memoize from "lodash/memoize";

class Navigation {
  static frontend = memoize(authentication => {
    const out = [
      {
        label: "Home",
        route: "frontend",
        matchType: "link"
      },
      {
        label: "Projects",
        route: "frontendProjects",
        children: [
          {
            label: "All Projects",
            route: "frontendProjectsAll"
          },
          {
            label: "Project Collections",
            route: "frontendProjectCollections"
          }
        ]
      }
    ];

    if (authentication.currentUser) {
      out.push({
        label: "Following",
        route: "frontendFollowing"
      });
    }
    return out;
  });

  static backend = memoize(() => {
    return [
      {
        label: "Dashboard",
        route: "backendDashboard"
      },
      {
        label: "Projects",
        route: "backendProjects",
        children: [
          {
            label: "All Projects",
            route: "backendProjectsAll"
          },
          {
            label: "Project Collections",
            route: "backendProjectCollections"
          }
        ]
      },
      {
        label: "Records",
        route: "backendRecords",
        entity: ["user", "maker", "page", "feature", "exportTarget"],
        ability: "update",
        children: [
          {
            label: "Makers",
            route: "backendRecordsMakers",
            entity: "maker",
            ability: "update"
          },
          {
            label: "Users",
            route: "backendRecordsUsers",
            entity: "user",
            ability: "update"
          },
          {
            label: "Pages",
            route: "backendRecordsPages",
            entity: "page",
            ability: "update"
          },
          {
            label: "Features",
            route: "backendRecordsFeatures",
            entity: "feature",
            ability: "update"
          },
          {
            label: "Export Targets",
            route: "backendRecordsExportTargets",
            entity: "exportTarget",
            ability: "update"
          }
        ]
      },
      {
        label: "Settings",
        route: "backendSettings",
        entity: "settings",
        ability: "update",
        children: [
          {
            label: "General",
            route: "backendSettingsGeneral"
          },
          {
            label: "Theme",
            route: "backendSettingsTheme"
          },
          {
            label: "Integrations",
            route: "backendSettingsIntegrations"
          },
          {
            label: "Subjects",
            route: "backendSettingsSubjects"
          },
          {
            label: "Email",
            route: "backendSettingsEmail"
          }
        ]
      }
    ];
  });

  static resourceCollection(collection) {
    const args = [collection.id];
    return [
      {
        label: "General",
        route: "backendResourceCollectionGeneral",
        entity: collection,
        ability: "update",
        args
      },
      {
        label: "Resources",
        route: "backendResourceCollectionResources",
        entity: collection,
        ability: "update",
        args
      }
    ];
  }

  static page = memoize(page => {
    const args = [page.id];
    return [
      {
        label: "General",
        route: "backendRecordsPageGeneral",
        entity: page,
        ability: "update",
        args
      }
    ];
  });

  static project = memoize(project => {
    const args = [project.id];
    return [
      {
        label: "General",
        route: "backendProjectGeneral",
        entity: project,
        ability: "update",
        args
      },
      {
        label: "Layout",
        route: "backendProjectLayout",
        entity: project,
        ability: "update",
        args
      },
      {
        label: "Permissions",
        route: "backendProjectPermissions",
        entity: project,
        ability: "managePermissions",
        args
      },
      {
        label: "People",
        route: "backendProjectCollaborators",
        entity: project,
        ability: "updateMakers",
        args
      },
      {
        label: "Texts",
        route: "backendProjectTexts",
        entity: project,
        ability: "manageTexts",
        args
      },
      {
        label: "Resources",
        route: "backendProjectResources",
        entity: project,
        ability: "manageResources",
        args
      },
      {
        label: "Resource Collections",
        route: "backendProjectResourceCollections",
        entity: project,
        ability: "manageResourceCollections",
        args
      },
      {
        label: "Activity",
        route: "backendProjectEvents",
        entity: project,
        ability: "manageEvents",
        args
      },
      {
        label: "Metadata",
        route: "backendProjectMetadata",
        entity: project,
        ability: "update",
        args
      },
      {
        label: "Social Integrations",
        route: "backendProjectSocial",
        entity: project,
        ability: "manageSocials",
        args
      },
      {
        label: "Exports",
        route: "backendProjectExportations",
        entity: project,
        ability: "manageProjectExportations",
        args
      },
      {
        label: "Log",
        route: "backendProjectLog",
        entity: project,
        ability: "readLog",
        args
      }
    ];
  });

  static projects = memoize(() => {
    return [
      {
        label: "All Projects",
        route: "backendProjectsAll",
        entity: "project",
        ability: "update"
      },
      {
        label: "Project Collections",
        route: "backendProjectCollections",
        entity: "projectCollection",
        ability: "update"
      }
    ];
  });

  static records = memoize(() => {
    return [
      {
        label: "Makers",
        route: "backendRecordsMakers",
        entity: "maker",
        ability: "update"
      },
      {
        label: "Users",
        route: "backendRecordsUsers",
        entity: "user",
        ability: "update"
      },
      {
        label: "Pages",
        route: "backendRecordsPages",
        entity: "page",
        ability: "update"
      },
      {
        label: "Features",
        route: "backendRecordsFeatures",
        entity: "feature",
        ability: "update"
      },
      {
        label: "Export Targets",
        route: "backendRecordsExportTargets",
        entity: "exportTarget",
        ability: "update"
      }
    ];
  });

  static resource = memoize(resource => {
    const externalVideo = resource.attributes.externalVideo;
    const project = resource.relationships.project;
    const kind = resource.attributes.kind;
    const args = [resource.id];
    const out = [
      {
        label: "General",
        route: "backendResourceGeneral",
        entity: project,
        ability: "update",
        args
      },
      {
        label: "Metadata",
        route: "backendResourceMetadata",
        entity: project,
        ability: "manageResources",
        args
      }
    ];
    if (
      kind === "image" ||
      kind === "audio" ||
      kind === "pdf" ||
      kind === "interactive" ||
      (kind === "video" && !externalVideo)
    ) {
      out.splice(1, 0, {
        label: "Variants",
        route: "backendResourceVariants",
        entity: project,
        ability: "update",
        args
      });
    }
    return out;
  });

  static settings = memoize(() => {
    return [
      {
        label: "General",
        route: "backendSettingsGeneral",
        entity: "settings",
        ability: "update"
      },
      {
        label: "Theme",
        route: "backendSettingsTheme",
        entity: "settings",
        ability: "update"
      },
      {
        label: "Integrations",
        route: "backendSettingsIntegrations",
        entity: "settings",
        ability: "update"
      },
      {
        label: "Subjects",
        route: "backendSettingsSubjects",
        entity: "settings",
        ability: "update"
      },
      {
        label: "Email",
        route: "backendSettingsEmail",
        entity: "settings",
        ability: "update"
      }
    ];
  });

  static text = memoize(text => {
    const args = [text.id];
    return [
      {
        label: "General",
        route: "backendTextGeneral",
        entity: text,
        ability: "update",
        args
      },
      {
        label: "People",
        route: "backendTextCollaborators",
        entity: text.relationships.project,
        ability: "updateMakers",
        args
      },
      {
        label: "Metadata",
        route: "backendTextMetadata",
        entity: text,
        ability: "update",
        args
      },
      {
        label: "Styles",
        route: "backendTextStyles",
        entity: text,
        ability: "update",
        args
      },
      {
        label: "Reingest",
        route: "backendTextIngestionsNew",
        entity: text,
        ability: "update",
        args
      }
    ];
  });
}

export default Navigation;
