import actionBox from "./actionBox";
import actionPanel from "./actionPanel";
import pageHeading from "./pageHeading";
import pageBody from "./pageBody";
import removeMember from "./removeMember";
import summary from "./summary";
import notesFilter from "./notesFilter";
import childRouteNav from "./childRouteNav";
import joinForm from "./joinForm";
import homepageModeToggle from "./homepageModeToggle";
import settingsFormGroup from "./settingsFormGroup";
import settingsFormMember from "./settingsFormMember";
import collectionCategory from "collectionCategory";
import collectablePlaceholderContent from "./collectablePlaceholderContent";
import homepageEditor from "./homepageEditor";
import groupsPageContainer from "./groupsPageContainer";

export default `
${actionBox}
${actionPanel}
${collectablePlaceholderContent}
${collectionCategory}
${groupsPageContainer}
${homepageEditor}
${homepageModeToggle}
${pageBody}
${removeMember}
${settingsFormGroup}
${settingsFormMember}
${notesFilter}
${childRouteNav}
`;
