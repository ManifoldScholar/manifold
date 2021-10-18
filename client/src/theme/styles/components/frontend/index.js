import splash from "./splash";
import collecting from "./collecting";
import contentBlock from "./content-block";
import events from "./event";
import groups from "./groups";
import layout from "./layout";
import page from "./page";
import project from "./project";
import projectCollection from "./project-collection";
import projectList from "./project-list";
import resource from "./resource";
import resourceCollection from "./resource-collection";
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
  ${projectCollection}
  ${projectList}
  ${resourceCollection}
  ${search}
  ${text}
  ${subscriptions}
  ${resource}
`;
