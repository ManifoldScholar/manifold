import lh from "helpers/linkHandler";
import startsWith from "lodash/startsWith";

class Navigation {
  static frontend(match, location, authentication) {
    const { pathname } = location;

    const projectsActive = () => {
      if (!match) return false;
      return pathname === "/" || startsWith(pathname, "/project");
    };
    const followingActive = () => {
      if (!match) return false;
      return startsWith(pathname, "/following");
    };

    const out = [
      {
        label: "Projects",
        path: lh.link("frontend"),
        key: "projects",
        isActive: projectsActive
      }
    ];

    if (authentication.currentUser) {
      out.push({
          label: "Following",
          path: lh.link("frontendFollowing"),
          key: "projects-following",
          isActive: followingActive });
    }

    return out;
  }

  static backend(match, location) {
    const isActive = () => {
      if (!match) return false;

      const { pathname } = location;
      return pathname === "/backend";
    };

    return [
      {
        label: "Dashboard",
        path: lh.link("backend"),
        key: "backend",
        isActive: isActive
      },
      {
        label: "Projects",
        path: lh.link("backendProjects"),
        key: "projects",
        children: [
          {
            label: "All Projects",
            path: lh.link("backendProjects"),
            key: "projects-all-projects"
          }
        ]
      },
      {
        label: "Records",
        path: lh.link("backendRecords"),
        key: "records",
        entity: ["user", "maker", "page", "feature"],
        ability: "update",
        children: [
          {
            label: "Makers",
            path: lh.link("backendRecordsMakers"),
            key: "records-makers",
            entity: "maker",
            ability: "update"
          },
          {
            label: "Users",
            path: lh.link("backendRecordsUsers"),
            key: "records-users",
            entity: "user",
            ability: "update"
          },
          {
            label: "Pages",
            path: lh.link("backendRecordsPages"),
            key: "records-pages",
            entity: "page",
            ability: "update"
          },
          {
            label: "Features",
            path: lh.link("backendRecordsFeatures"),
            key: "records-features",
            entity: "feature",
            ability: "update"
          }
        ]
      },
      {
        label: "Settings",
        path: lh.link("backendSettings"),
        key: "settings",
        entity: "settings",
        ability: "update",
        children: [
          {
            label: "General",
            path: lh.link("backendSettingsGeneral"),
            key: "settings-general"
          },
          {
            label: "Theme",
            path: lh.link("backendSettingsTheme"),
            key: "settings-theme"
          },
          {
            label: "Integrations",
            path: lh.link("backendSettingsIntegrations"),
            key: "settings-integrations"
          },
          {
            label: "Subjects",
            path: lh.link("backendSettingsSubjects"),
            key: "settings-subjects"
          },
          {
            label: "Email",
            path: lh.link("backendSettingsEmail"),
            key: "settings-email"
          }
        ]
      }
    ]
  }

  static collection(collection) {
    return [
      {
        path: lh.link("backendCollectionGeneral", collection.id),
        label: "General",
        key: "general",
        entity: collection,
        ability: "update"
      },
      {
        path: lh.link("backendCollectionResources", collection.id),
        label: "Resources",
        key: "resources",
        entity: collection,
        ability: "update"
      }
    ];
  }

  static page(page) {
    return [
      {
        path: lh.link("backendRecordsPageGeneral", page.id),
        label: "General",
        key: "general",
        entity: page,
        ability: "update"
      }
    ];
  }

  static project(project) {
    return [
      {
        path: lh.link("backendProjectGeneral", project.id),
        label: "General",
        key: "general",
        entity: project,
        ability: "update"
      },
      {
        path: lh.link("backendProjectProjectPage", project.id),
        label: "Appearance",
        key: "projectPage",
        entity: project,
        ability: "update"
      },
      {
        path: lh.link("backendProjectPermissions", project.id),
        label: "Permissions",
        key: "permissions",
        entity: project,
        ability: "managePermissions"
      },
      {
        path: lh.link("backendProjectCollaborators", project.id),
        label: "People",
        key: "collaborators",
        entity: project,
        ability: "updateMakers"
      },
      {
        path: lh.link("backendProjectTexts", project.id),
        label: "Texts",
        key: "texts",
        entity: project,
        ability: "manageTexts"
      },
      {
        path: lh.link("backendProjectResources", project.id),
        label: "Resources",
        key: "resources",
        entity: project,
        ability: "manageResources"
      },
      {
        path: lh.link("backendProjectCollections", project.id),
        label: "Collections",
        key: "collections",
        entity: project,
        ability: "manageCollections"
      },
      {
        path: lh.link("backendProjectEvents", project.id),
        label: "Activity",
        key: "events",
        entity: project,
        ability: "manageEvents"
      },
      {
        path: lh.link("backendProjectMetadata", project.id),
        label: "Metadata",
        key: "metadata",
        entity: project,
        ability: "update"
      },
      {
        path: lh.link("backendProjectSocial", project.id),
        label: "Social Integrations",
        key: "social",
        entity: project,
        ability: "manageSocials"
      },
      {
        path: lh.link("backendProjectLog", project.id),
        label: "Log",
        key: "log",
        entity: project,
        ability: "readLog"
      }
    ];
  }

  static projects() {
    return [
      {
        path: lh.link("backendProjects"),
        label: "All Projects",
        key: "projects",
        entity: "project",
        ability: "update"
      }
    ];
  }

  static records() {
    return [
      {
        path: lh.link("backendRecordsMakers"),
        label: "Makers",
        key: "makers",
        entity: "maker",
        ability: "update"
      },
      {
        path: lh.link("backendRecordsUsers"),
        label: "Users",
        key: "users",
        entity: "user",
        ability: "update"
      },
      {
        path: lh.link("backendRecordsPages"),
        label: "Pages",
        key: "pages",
        entity: "page",
        ability: "update"
      },
      {
        path: lh.link("backendRecordsFeatures"),
        label: "Features",
        key: "features",
        entity: "user",
        ability: "update"
      }
    ];
  }

  static resource(resource) {
    const externalVideo = resource.attributes.externalVideo;
    const project = resource.relationships.project;
    const kind = resource.attributes.kind;
    const out = [
      {
        path: lh.link("backendResourceGeneral", resource.id),
        label: "General",
        key: "general",
        entity: project,
        ability: "update"
      },
      {
        path: lh.link("backendResourceMetadata", resource.id),
        label: "Metadata",
        key: "metadata",
        entity: project,
        ability: "manageResources"
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
        path: lh.link("backendResourceVariants", resource.id),
        label: "Variants",
        key: "variants",
        entity: project,
        ability: "update"
      });
    }
    return out;
  }

  static settings() {
    return [
      {
        path: lh.link("backendSettingsGeneral"),
        label: "General",
        key: "general",
        entity: "settings",
        ability: "update"
      },
      {
        path: lh.link("backendSettingsTheme"),
        label: "Theme",
        key: "theme",
        entity: "settings",
        ability: "update"
      },
      {
        path: lh.link("backendSettingsIntegrations"),
        label: "Integrations",
        key: "integrations",
        entity: "settings",
        ability: "update"
      },
      {
        path: lh.link("backendSettingsSubjects"),
        label: "Subjects",
        key: "subjects",
        entity: "settings",
        ability: "update"
      },
      {
        path: lh.link("backendSettingsEmail"),
        label: "Email",
        key: "email",
        entity: "settings",
        ability: "update"
      }
    ];
  }

  static text(text) {
    return [
      {
        path: lh.link("backendTextGeneral", text.id),
        label: "General",
        key: "general",
        entity: text,
        ability: "update"
      },
      {
        path: lh.link("backendTextCollaborators", text.id),
        label: "People",
        key: "collaborators",
        entity: text.relationships.project,
        ability: "updateMakers"
      },
      {
        path: lh.link("backendTextMetadata", text.id),
        label: "Metadata",
        key: "metadata",
        entity: text,
        ability: "update"
      },
      {
        path: lh.link("backendTextStyles", text.id),
        label: "Styles",
        key: "styles"
      },
      {
        path: lh.link("backendTextIngestionsNew", text.id),
        label: "Reingest",
        key: "reingest",
        entity: text,
        ability: "update"
      }
    ];
  }
}

export default Navigation;
