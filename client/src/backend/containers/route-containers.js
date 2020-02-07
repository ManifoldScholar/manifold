import Backend from "backend/containers/Backend";
import Dashboard from "backend/containers/Dashboard";
import Projects from "backend/containers/projects";
import Resource from "backend/containers/resource";
import ResourceImport from "backend/containers/resource-import";
import ResourceCollection from "backend/containers/resource-collection";
import Project from "backend/containers/project";
import Text from "backend/containers/text";
import Stylesheet from "backend/containers/stylesheet";
import Makers from "backend/containers/makers";
import Ingestion from "backend/containers/ingestion";
import ProjectCollection from "backend/containers/project-collection";
import Permission from "backend/containers/permission";
import TwitterQuery from "backend/containers/twitter-query";
import Records from "backend/containers/Records";
import Users from "backend/containers/users";
import Pages from "backend/containers/pages";
import Features from "backend/containers/features";
import Settings from "backend/containers/settings";
import Content from "backend/containers/content-block";
import ActionCallout from "backend/containers/action-callout";
import ExportTargets from "backend/containers/records/export-targets";

export default {
  Backend,
  Dashboard,
  ProjectsWrapper: Projects.Wrapper,
  ProjectsList: Projects.ProjectsList,
  ResourceNew: Resource.New,
  ResourceImportWrapper: ResourceImport.Wrapper,
  ResourceImportNew: ResourceImport.New,
  ResourceImportMap: ResourceImport.Map,
  ResourceImportResults: ResourceImport.Results,
  ResourceCollectionNew: ResourceCollection.New,
  ProjectNew: Project.New,
  ResourceWrapper: Resource.Wrapper,
  ResourceVariants: Resource.Variants,
  ResourceMetadata: Resource.Metadata,
  ResourceGeneral: Resource.General,
  ResourceCollectionWrapper: ResourceCollection.Wrapper,
  ResourceCollectionGeneral: ResourceCollection.General,
  ResourceCollectionResources: ResourceCollection.Resources,
  TextWrapper: Text.Wrapper,
  TextStyles: Text.Styles,
  StylesheetEdit: Stylesheet.Edit,
  TextMetadata: Text.Metadata,
  TextCollaborators: Text.Collaborators,
  TextIngestionNew: Text.Ingestion.New,
  TextIngestionEdit: Text.Ingestion.Edit,
  TextGeneral: Text.General,
  ProjectCollectionWrapper: ProjectCollection.Wrapper,
  ProjectCollectionDetail: ProjectCollection.Detail,
  ProjectCollectionManageProjects: ProjectCollection.ManageProjects,
  ProjectCollectionSettings: ProjectCollection.Settings,
  ProjectWrapper: Project.Wrapper,
  ProjectTexts: Project.Texts,
  ProjectTextIngestionNew: Project.Text.Ingestion.New,
  ProjectTextIngestionEdit: Project.Text.Ingestion.Edit,
  IngestionIngest: Ingestion.Ingest,
  ProjectCategoryWrapper: Project.Category.Wrapper,
  ProjectCategoryNew: Project.Category.New,
  ProjectCategoryEdit: Project.Category.Edit,
  ProjectResources: Project.Resources,
  ProjectResourceCollections: Project.ResourceCollections,
  ProjectPermissions: Project.Permissions,
  PermissionNew: Permission.New,
  PermissionEdit: Permission.Edit,
  ProjectCollaborators: Project.Collaborators,
  ProjectEvents: Project.Events,
  ProjectMetadata: Project.Metadata,
  ProjectSocialWrapper: Project.Social.Wrapper,
  TwitterQueryNew: TwitterQuery.New,
  TwitterQueryEdit: TwitterQuery.Edit,
  ProjectContent: Project.Content,
  ContentBlockNew: Content.New,
  ContentBlockEdit: Content.Edit,
  ProjectLog: Project.Log,
  ProjectGeneral: Project.General,
  Records,
  UsersList: Users.List,
  UsersNew: Users.New,
  UsersEdit: Users.Edit,
  MakersList: Makers.List,
  MakersNew: Makers.New,
  MakersEdit: Makers.Edit,
  PagesDetail: Pages.Detail,
  PagesNew: Pages.New,
  PagesBody: Pages.Body,
  PagesGeneral: Pages.General,
  FeaturesDetail: Features.Detail,
  FeaturesNew: Features.New,
  FeaturesGeneral: Features.General,
  PagesList: Pages.List,
  FeaturesList: Features.List,
  ExportTargetsList: ExportTargets.List,
  SettingsWrapper: Settings.Wrapper,
  SettingsTheme: Settings.Theme,
  SettingsIntegrations: Settings.Integrations,
  SettingsSubjectsList: Settings.Subjects.List,
  SettingsSubjectsNew: Settings.Subjects.New,
  SettingsSubjectsEdit: Settings.Subjects.Edit,
  SettingsEmail: Settings.Email,
  SettingsGeneral: Settings.General,
  ActionCalloutNew: ActionCallout.New,
  ActionCalloutEdit: ActionCallout.Edit
};
