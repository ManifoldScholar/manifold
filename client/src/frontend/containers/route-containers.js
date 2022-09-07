import NotFound from "global/containers/NotFound";
import ApiDocs from "frontend/containers/Api";
import Frontend from "frontend/containers/Frontend";
import ProjectsWrapper from "frontend/containers/ProjectsWrapper";
import Projects from "frontend/containers/Projects";
import ProjectCollections from "frontend/containers/ProjectCollections";
import ProjectCollectionDetail from "frontend/containers/ProjectCollectionDetail";
import ProjectWrapper from "frontend/containers/ProjectWrapper";
import ProjectDetail from "frontend/containers/ProjectDetail";
import ProjectSearch from "frontend/containers/ProjectSearch";
import ProjectResources from "frontend/containers/ProjectResources";
import ResourceDetail from "frontend/containers/ResourceDetail";
import ProjectResourceCollections from "frontend/containers/ProjectResourceCollections";
import ResourceCollectionDetail from "frontend/containers/ResourceCollectionDetail";
import EventList from "frontend/containers/EventList";
import Search from "frontend/containers/Search";
import Contact from "frontend/containers/Contact";
import PasswordReset from "frontend/containers/PasswordReset";
import Page from "frontend/containers/Page";
import Subscriptions from "frontend/containers/Subscriptions";
import Unsubscribe from "frontend/containers/Unsubscribe";
import Home from "frontend/containers/Home";
import MyReadingGroups from "frontend/containers/MyReadingGroups";
import PublicReadingGroups from "frontend/containers/PublicReadingGroups";
import ReadingGroup from "frontend/containers/ReadingGroup";
import ReadingGroupMembers from "frontend/containers/ReadingGroup/Members";
import ReadingGroupAnnotations from "frontend/containers/ReadingGroup/Annotations";
import ReadingGroupHomepage from "frontend/containers/ReadingGroup/Homepage";
import Login from "frontend/containers/Login";
import MyStarred from "frontend/containers/MyStarred";
import MyAnnotations from "frontend/containers/MyAnnotations";
import IssuesList from "frontend/containers/IssuesList";
import JournalsWrapper from "frontend/containers/JournalsWrapper";
import JournalsList from "frontend/containers/JournalsList";
import JournalWrapper from "frontend/containers/JournalWrapper";
import JournalDetail from "frontend/containers/JournalDetail";
import VolumeDetail from "frontend/containers/VolumeDetail";
import JournalVolumesList from "frontend/containers/JournalVolumesList";
import JournalIssuesList from "frontend/containers/JournalIssuesList";
import PrivacySettings from "frontend/containers/PrivacySettings";
import DataUse from "frontend/containers/DataUse";

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
