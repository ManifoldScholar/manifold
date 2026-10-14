/* eslint-disable import/extensions */
import analytics from "./analytics.json";
import entitlements from "./entitlements.json";
import journals from "./journals.json";
import layout from "./layout.json";
import projectCollections from "./project_collections.json";
import projects from "./projects.json";
import records from "./records.json";
import resourceCollections from "./resource_collections.json";
import resources from "./resources.json";
import settings from "./settings.json";
import texts from "./texts.json";
import editor from "./editor.json";

export default {
  ...analytics,
  ...entitlements,
  ...journals,
  ...layout,
  ...projectCollections,
  ...projects,
  ...records,
  ...resourceCollections,
  ...resources,
  ...settings,
  ...texts,
  ...editor
};
