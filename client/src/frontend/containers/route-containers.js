import loadable from "@loadable/component";
import NotFound from "global/containers/NotFound";

import MyReadingGroups from "frontend/containers/MyReadingGroups";
import PublicReadingGroups from "frontend/containers/PublicReadingGroups";
import ReadingGroup from "frontend/containers/ReadingGroup";
import ReadingGroupMembers from "frontend/containers/ReadingGroup/Members";
import ReadingGroupAnnotations from "frontend/containers/ReadingGroup/Annotations";
import ReadingGroupHomepage from "frontend/containers/ReadingGroup/Homepage";

const ApiDocs = loadable(() => import("frontend/containers/Api"));
const Frontend = loadable(() => import("frontend/containers/Frontend"));
const ProjectsWrapper = loadable(() =>
  import("frontend/containers/ProjectsWrapper")
);
const Projects = loadable(() => import("frontend/containers/Projects"));
const ProjectCollections = loadable(() =>
  import("frontend/containers/ProjectCollections")
);
const ProjectCollectionDetail = loadable(() =>
  import("frontend/containers/ProjectCollectionDetail")
);
const ProjectWrapper = loadable(() =>
  import("frontend/containers/ProjectWrapper")
);
const ProjectDetail = loadable(() =>
  import("frontend/containers/ProjectDetail")
);
const ProjectSearch = loadable(() =>
  import("frontend/containers/ProjectSearch")
);
const ProjectResources = loadable(() =>
  import("frontend/containers/ProjectResources")
);
const ResourceDetail = loadable(() =>
  import("frontend/containers/ResourceDetail")
);
const ProjectResourceCollections = loadable(() =>
  import("frontend/containers/ProjectResourceCollections")
);
const ResourceCollectionDetail = loadable(() =>
  import("frontend/containers/ResourceCollectionDetail")
);
const EventList = loadable(() => import("frontend/containers/EventList"));
const Search = loadable(() => import("frontend/containers/Search"));
const Contact = loadable(() => import("frontend/containers/Contact"));
const PasswordReset = loadable(() =>
  import("frontend/containers/PasswordReset")
);
const Page = loadable(() => import("frontend/containers/Page"));
const Subscriptions = loadable(() =>
  import("frontend/containers/Subscriptions")
);
const Unsubscribe = loadable(() => import("frontend/containers/Unsubscribe"));
const Home = loadable(() => import("frontend/containers/Home"));
const Login = loadable(() => import("frontend/containers/Login"));
const MyStarred = loadable(() => import("frontend/containers/MyStarred"));
const MyAnnotations = loadable(() =>
  import("frontend/containers/MyAnnotations")
);
const IssuesList = loadable(() => import("frontend/containers/IssuesList"));
const JournalsWrapper = loadable(() =>
  import("frontend/containers/JournalsWrapper")
);
const JournalsList = loadable(() => import("frontend/containers/JournalsList"));
const JournalWrapper = loadable(() =>
  import("frontend/containers/JournalWrapper")
);
const JournalDetail = loadable(() =>
  import("frontend/containers/JournalDetail")
);
const VolumeDetail = loadable(() => import("frontend/containers/VolumeDetail"));
const JournalVolumesList = loadable(() =>
  import("frontend/containers/JournalVolumesList")
);
const JournalIssuesList = loadable(() =>
  import("frontend/containers/JournalIssuesList")
);
const PrivacySettings = loadable(() =>
  import("frontend/containers/PrivacySettings")
);
const DataUse = loadable(() => import("frontend/containers/DataUse"));

export default {
  NotFound,
  ApiDocs,
  Frontend,
  JournalsWrapper,
  JournalsList,
  JournalWrapper,
  JournalDetail,
  JournalVolumesList,
  JournalIssuesList,
  VolumeDetail,
  IssuesList,
  ProjectsWrapper,
  Projects,
  ProjectCollections,
  ProjectCollectionDetail,
  ProjectWrapper,
  ProjectDetail,
  ProjectSearch,
  ProjectResources,
  ResourceDetail,
  ProjectResourceCollections,
  ResourceCollectionDetail,
  EventList,
  Search,
  Contact,
  PasswordReset,
  Page,
  Subscriptions,
  Unsubscribe,
  Home,
  MyReadingGroups: MyReadingGroups.Wrapper,
  MyReadingGroupsList: MyReadingGroups.List,
  MyReadingGroupsNew: MyReadingGroups.New,
  PublicReadingGroups: PublicReadingGroups.Wrapper,
  PublicReadingGroupsList: PublicReadingGroups.List,
  ReadingGroup,
  ReadingGroupMembers: ReadingGroupMembers.Wrapper,
  ReadingGroupMembersList: ReadingGroupMembers.List,
  ReadingGroupMemberEdit: ReadingGroupMembers.MemberEdit,
  ReadingGroupAnnotations,
  ReadingGroupHomepage: ReadingGroupHomepage.Wrapper,
  ReadingGroupHomepageStatic: ReadingGroupHomepage.Static,
  ReadingGroupHomepageEdit: ReadingGroupHomepage.Edit,
  ReadingGroupHomepageFetch: ReadingGroupHomepage.Fetch,
  Login,
  MyStarred,
  MyAnnotations,
  PrivacySettings,
  DataUse
};
