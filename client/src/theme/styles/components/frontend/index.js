import splash from "./splash";
import collecting from "./collecting";
import contentBlock from "./contentBlock";
import events from "./event";
import groups from "./groups";
import layout from "./layout";
import loginPage from "./loginPage";
import page from "./page";
import project from "./project";
import projectList from "./projectList";
import resource from "./resource";
import resourceCollection from "./resourceCollection";
import search from "./search";
import subscriptions from "./subscriptions";
import text from "./text";

export default `
  ${splash}
  ${collecting}
  ${events}
  ${groups}
  ${contentBlock}
  ${layout}
  ${page}
  ${project}
  ${projectList}
  ${resourceCollection}
  ${search}
  ${text}
  ${subscriptions}
  ${resource}
  ${loginPage}
`;
