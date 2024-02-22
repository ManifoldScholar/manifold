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
        route: "frontend",
        matchType: "link"
      },
      {
        label: "titles.projects",
        route: "frontendProjects",
        children: [
          {
            label: "titles.projects_all",
            route: "frontendProjectsAll"
          },
          {
            label: "titles.project_collections",
            route: "frontendProjectCollections"
          }
        ]
      },
      settings.attributes.calculated.hasVisibleJournals && {
        label: "titles.journals",
        route: "frontendJournals",
        children: [
          {
            label: "titles.journals_all",
            route: "frontendJournalsList"
          },
          {
            label: "titles.issues_all",
            route: "frontendIssuesList"
          }
        ]
      },
      !hideRGs && {
        label: "titles.groups",
        route: "frontendPublicReadingGroups"
      }
    ].filter(x => x);
  }

  static backend = memoize(() => {
    return [
      {
        label: "titles.dashboard",
        route: "backendDashboard"
      },
      {
        label: "titles.projects",
        route: "backendProjects",
        dropdown: true,
        children: [
          {
            label: "titles.projects_all",
            route: "backendProjectsAll"
          },
          {
            label: "titles.project_collections",
            route: "backendProjectCollections"
          }
        ]
      },
      {
        label: "titles.journals",
        route: "backendJournals"
      },
      {
        label: "titles.records",
        route: "backendRecords",
        entity: ["user", "maker", "page", "feature"],
        ability: "update",
        children: [
          {
            label: "titles.makers",
            route: "backendRecordsMakers",
            entity: "maker",
            ability: "update"
          },
          {
            label: "titles.users",
            route: "backendRecordsUsers",
            entity: "user",
            ability: "update"
          },
          {
            label: "titles.pages",
            route: "backendRecordsPages",
            entity: "page",
            ability: "update"
          },
          {
            label: "titles.features",
            route: "backendRecordsFeatures",
            entity: "feature",
            ability: "update"
          },
          {
            label: "titles.entitlements",
            route: "backendRecordsEntitlements",
            entity: "entitlement",
            ability: "update"
          }
        ]
      },
      {
        label: "titles.settings",
        route: "backendSettings",
        entity: "settings",
        ability: "update",
        children: [
          {
            label: "titles.properties",
            route: "backendSettingsProperties"
          },
          {
            label: "titles.theme",
            route: "backendSettingsTheme"
          },
          {
            label: "titles.ingestion",
            route: "backendSettingsIngestion"
          },
          {
            label: "titles.integrations",
            route: "backendSettingsIntegrations"
          },
          {
            label: "titles.subjects",
            route: "backendSettingsSubjects"
          },
          {
            label: "titles.email",
            route: "backendSettingsEmail"
          },
          {
            label: "titles.export_targets",
            route: "backendSettingsExportTargets",
            entity: "exportTarget",
            ability: "update"
          }
        ]
      },
      {
        label: "titles.analytics",
        route: "backendAnalytics",
        entity: "statistics",
        ability: "read",
        children: []
      }
    ];
  });

  static resourceCollection(collection) {
    const args = [collection.id];
    return [
      {
        label: "titles.properties",
        route: "backendResourceCollectionProperties",
        entity: collection,
        ability: "update",
        args
      },
      {
        label: "titles.resources",
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
        label: "titles.properties",
        route: "backendRecordsPageProperties",
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
        label: "titles.analytics",
        route: "backendProjectAnalytics",
        entity: project,
        ability: "update",
        args
      },
      {
        label: "titles.properties",
        route: "backendProjectProperties",
        entity: project,
        ability: "update",
        args
      },
      {
        label: "titles.layout",
        route: "backendProjectLayout",
        entity: project,
        ability: "update",
        args
      },
      {
        label: "titles.access",
        route: "backendProjectAccess",
        entity: project,
        ability: "update",
        args
      },
      {
        label: "titles.collaborators",
        route: "backendProjectCollaborators",
        entity: project,
        ability: "updateMakers",
        args
      },
      {
        label: "titles.texts",
        route: "backendProjectTexts",
        entity: project,
        ability: "manageTexts",
        args
      },
      {
        label: "titles.resources",
        route: "backendProjectResources",
        entity: project,
        ability: "manageResources",
        args
      },
      {
        label: "titles.resource_collections",
        route: "backendProjectResourceCollections",
        entity: project,
        ability: "manageResourceCollections",
        args
      },
      {
        label: "titles.events",
        route: "backendProjectEvents",
        entity: project,
        ability: "manageEvents",
        args
      },
      {
        label: "titles.metadata",
        route: "backendProjectMetadata",
        entity: project,
        ability: "update",
        args
      },
      {
        label: "titles.social",
        route: "backendProjectSocial",
        entity: project,
        ability: "manageSocials",
        args
      },
      {
        label: "titles.exports",
        route: "backendProjectExportations",
        entity: project,
        ability: "manageProjectExportations",
        args
      },
      {
        label: "titles.log",
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
        label: "titles.projects_all",
        route: "backendProjectsAll",
        entity: "project",
        ability: "update"
      },
      {
        label: "titles.project_collections",
        route: "backendProjectCollections",
        entity: "projectCollection",
        ability: "update"
      }
    ];
  });

  static journal = memoize(journal => {
    const args = [journal.id];
    return [
      {
        label: "titles.properties",
        route: "backendJournalProperties",
        entity: journal,
        ability: "update",
        args
      },
      {
        label: "titles.layout",
        route: "backendJournalLayout",
        entity: journal,
        ability: "update",
        args
      },
      {
        label: "titles.access",
        route: "backendJournalAccess",
        entity: journal,
        ability: "update",
        args
      },
      {
        label: "titles.metadata",
        route: "backendJournalMetadata",
        entity: journal,
        ability: "update",
        args
      },
      {
        label: "titles.issues",
        route: "backendJournalIssues",
        entity: journal,
        ability: "read",
        args
      },
      {
        label: "titles.volumes",
        route: "backendJournalVolumes",
        entity: journal,
        ability: "update",
        args
      }
    ];
  });

  static records = memoize(() => {
    return [
      {
        label: "titles.makers",
        route: "backendRecordsMakers",
        entity: "maker",
        ability: "update"
      },
      {
        label: "titles.users",
        route: "backendRecordsUsers",
        entity: "user",
        ability: "update"
      },
      {
        label: "titles.pages",
        route: "backendRecordsPages",
        entity: "page",
        ability: "update"
      },
      {
        label: "titles.features",
        route: "backendRecordsFeatures",
        entity: "feature",
        ability: "update"
      },
      {
        label: "Entitlements",
        route: "backendRecordsEntitlements",
        entity: "entitlementImport",
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
        label: "titles.properties",
        route: "backendResourceProperties",
        entity: project,
        ability: "update",
        args
      },
      {
        label: "titles.metadata",
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
        label: "titles.variants",
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
        label: "titles.properties",
        route: "backendSettingsProperties",
        entity: "settings",
        ability: "update"
      },
      {
        label: "titles.theme",
        route: "backendSettingsTheme",
        entity: "settings",
        ability: "update"
      },
      {
        label: "titles.integrations",
        route: "backendSettingsIntegrations",
        entity: "settings",
        ability: "update"
      },
      {
        label: "titles.ingestion",
        route: "backendSettingsIngestion",
        entity: "settings",
        ability: "update"
      },
      {
        label: "titles.subjects",
        route: "backendSettingsSubjects",
        entity: "settings",
        ability: "update"
      },
      {
        label: "titles.email",
        route: "backendSettingsEmail",
        entity: "settings",
        ability: "update"
      },
      {
        label: "titles.export_targets",
        route: "backendSettingsExportTargets",
        entity: "exportTarget",
        ability: "update"
      }
    ];
  });

  static text = memoize(text => {
    const args = [text.id];
    return [
      {
        label: "titles.analytics",
        route: "backendTextAnalytics",
        entity: text,
        ability: "update",
        args
      },
      {
        label: "titles.properties",
        route: "backendTextProperties",
        entity: text,
        ability: "update",
        args
      },
      {
        label: "titles.collaborators",
        route: "backendTextCollaborators",
        entity: text.relationships.project,
        ability: "updateMakers",
        args
      },
      {
        label: "titles.sections",
        route: "backendTextSections",
        entity: text,
        ability: "update",
        args
      },
      {
        label: "titles.toc",
        route: "backendTextTOC",
        entity: text,
        ability: "update",
        args
      },
      {
        label: "titles.assets",
        route: "backendTextAssets",
        entity: text,
        ability: "update",
        args
      },
      {
        label: "titles.metadata",
        route: "backendTextMetadata",
        entity: text,
        ability: "update",
        args
      },
      {
        label: "titles.styles",
        route: "backendTextStyles",
        entity: text,
        ability: "update",
        args
      },
      {
        label: "titles.reingest",
        route: "backendTextIngestionsNew",
        entity: text,
        ability: "update",
        args
      }
    ];
  });
}

export default Navigation;
