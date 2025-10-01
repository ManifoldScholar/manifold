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
import Records from "backend/containers/Records";
import Users from "backend/containers/users";
import Pages from "backend/containers/pages";
import Features from "backend/containers/features";
import Settings from "backend/containers/settings";
import Content from "backend/containers/content-block";
import ActionCallout from "backend/containers/action-callout";
import ExportTargets from "backend/containers/export-targets";
import Entitlements from "backend/containers/entitlements";
import EntitlementsPending from "backend/containers/entitlements-pending";
import Analytics from "backend/containers/analytics";
import Journals from "backend/containers/journals";
import Journal from "backend/containers/journal";
import ReadingGroups from "backend/containers/reading-groups";
import ReadingGroup from "backend/containers/reading-group";
import Annotations from "backend/containers/annotations";
import User from "backend/containers/user";
import Comments from "backend/containers/comments";
import TextTracks from "backend/containers/resource/tracks";

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
  ResourceProperties: Resource.Properties,
  ResourceCollectionWrapper: ResourceCollection.Wrapper,
  ResourceCollectionProperties: ResourceCollection.Properties,
  ResourceCollectionResources: ResourceCollection.Resources,
  TextWrapper: Text.Wrapper,
  TextAnalytics: Text.Analytics,
  TextStyles: Text.Styles,
  StylesheetEdit: Stylesheet.Edit,
  TextMetadata: Text.Metadata,
  TextCollaborators: Text.CollaboratorsList,
  TextAddCollaborator: Text.AddCollaborator,
  TextIngestionNew: Text.Ingestion.New,
  TextIngestionEdit: Text.Ingestion.Edit,
  TextProperties: Text.Properties,
  TextSections: Text.Sections,
  TextSectionNew: Text.Section.Author,
  TextSectionEdit: Text.Section.Author,
  TextSectionIngest: Text.Section.Ingest,
  TextSectionIngestEdit: Text.Section.Ingest,
  TextSectionIngestIngest: Ingestion.Ingest,
  TextSectionProperties: Text.Section.Properties,
  TextTOC: Text.TableOfContents,
  TextTOCEntryNew: Text.TOCEntry,
  TextTOCEntryEdit: Text.TOCEntry,
  TextAssets: Text.Assets.List,
  TextAssetAddEdit: Text.Assets.AddEdit,
  ProjectCollectionWrapper: ProjectCollection.Wrapper,
  ProjectCollectionDetail: ProjectCollection.Detail,
  ProjectCollectionManageProjects: ProjectCollection.ManageProjects,
  ProjectCollectionSettings: ProjectCollection.Settings,
  ProjectCollectionNew: ProjectCollection.New,
  ProjectWrapper: Project.Wrapper,
  ProjectTexts: Project.Texts,
  ProjectTextIngestionNew: Project.Text.Ingestion.New,
  ProjectTextIngestionEdit: Project.Text.Ingestion.Edit,
  IngestionIngest: Ingestion.Ingest,
  ProjectTextCreate: Project.Text.Create,
  ProjectCategoryWrapper: Project.Category.Wrapper,
  ProjectCategoryNew: Project.Category.New,
  ProjectCategoryEdit: Project.Category.Edit,
  ProjectResources: Project.Resources,
  ProjectResourceCollections: Project.ResourceCollections,
  ProjectAccessWrapper: Project.Access.Wrapper,
  ProjectPermissions: Project.Permissions,
  ProjectLog: Project.Log,
  ProjectProperties: Project.Properties,
  ProjectAnalytics: Project.Analytics,
  PermissionNew: Permission.New,
  PermissionEdit: Permission.Edit,
  ProjectCollaborators: Project.CollaboratorsList,
  ProjectAddCollaborator: Project.AddCollaborator,
  ProjectEvents: Project.Events,
  ProjectEntitlements: Project.ProjectEntitlements,
  ProjectExportations: Project.ProjectExportations,
  ProjectMetadata: Project.Metadata,
  ProjectLayout: Project.Layout,
  ContentBlockNew: Content.New,
  ContentBlockEdit: Content.Edit,
  Records,
  UsersList: Users.List,
  MakersList: Makers.List,
  MakersNew: Makers.New,
  MakersEdit: Makers.Edit,
  PagesDetail: Pages.Detail,
  PagesNew: Pages.New,
  PagesBody: Pages.Body,
  PagesProperties: Pages.Properties,
  FeaturesDetail: Features.Detail,
  FeaturesNew: Features.New,
  FeaturesProperties: Features.Properties,
  PagesList: Pages.List,
  FeaturesList: Features.List,
  ExportTargetsList: ExportTargets.List,
  ExportTargetsNew: ExportTargets.New,
  ExportTargetsEdit: ExportTargets.Edit,
  SettingsWrapper: Settings.Wrapper,
  SettingsTheme: Settings.Theme,
  SettingsContent: Settings.Content,
  SettingsIntegrations: Settings.Integrations,
  SettingsSubjectsList: Settings.Subjects.List,
  SettingsSubjectsNew: Settings.Subjects.New,
  SettingsSubjectsEdit: Settings.Subjects.Edit,
  SettingsEmail: Settings.Email,
  SettingsIngestion: Settings.Ingestion,
  SettingsProperties: Settings.Properties,
  ActionCalloutNew: ActionCallout.New,
  ActionCalloutEdit: ActionCallout.Edit,
  EntitlementsList: Entitlements.List,
  EntitlementsNew: Entitlements.New,
  AnalyticsWrapper: Analytics.Wrapper,
  AnalyticsGlobal: Analytics.Global,
  AnalyticsTopProjects: Analytics.TopProjects,
  AnalyticsTopSearches: Analytics.TopSearches,
  JournalsWrapper: Journals.Wrapper,
  JournalsList: Journals.List,
  JournalsNew: Journals.New,
  JournalWrapper: Journal.Wrapper,
  JournalProperties: Journal.Properties,
  JournalMetadata: Journal.Metadata,
  JournalLayout: Journal.Layout,
  JournalIssues: Journal.Issues,
  JournalIssueEdit: Journal.IssueEdit,
  JournalIssueNew: Journal.IssueNew,
  JournalIssueWrapper: Journal.IssueWrapper,
  JournalVolumes: Journal.Volumes,
  JournalVolumeEdit: Journal.VolumeEdit,
  JournalVolumeNew: Journal.VolumeNew,
  JournalVolumeWrapper: Journal.VolumeWrapper,
  JournalAccessWrapper: Journal.AccessWrapper,
  EntitlementsPending: EntitlementsPending.List,
  EntitlementsPendingNew: EntitlementsPending.AddEdit,
  EntitlementsPendingEdit: EntitlementsPending.AddEdit,
  EntitlementsPendingImport: EntitlementsPending.Import,
  CSVEntitlementImports: EntitlementsPending.CSVImports,
  ReadingGroupsWrapper: ReadingGroups.Wrapper,
  ReadingGroupsList: ReadingGroups.List,
  ReadingGroupWrapper: ReadingGroup.Wrapper,
  ReadingGroupMembers: ReadingGroup.Members,
  ReadingGroupAnnotations: ReadingGroup.Annotations,
  ReadingGroupDetails: ReadingGroup.Details,
  AnnotationsList: Annotations.List,
  AnnotationDetail: Annotations.Detail,
  CommentsList: Comments.List,
  CommentDetail: Comments.Detail,
  UserWrapper: User.Wrapper,
  UserProperties: User.Properties,
  UserActivity: User.Activity,
  ResourceTracksList: TextTracks.List,
  ResourceTrackAdd: TextTracks.AddEdit
};
