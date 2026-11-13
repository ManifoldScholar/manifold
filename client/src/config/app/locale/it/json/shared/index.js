/* eslint-disable import/extensions */
import actions from "./actions.json";
import common from "./common.json";
import counts from "./counts.json";
import errors from "./errors.json";
import glossary from "./glossary.json";
import metadata from "./metadata.json";
import modals from "./modals.json";
import navigation from "./navigation.json";
import utility from "./utility.json";
import notifications from "./notifications.json";
import pageTitles from "./page-titles.json";

export default {
  ...actions,
  ...common,
  ...counts,
  ...errors,
  ...glossary,
  ...metadata,
  ...modals,
  ...navigation,
  ...utility,
  ...notifications,
  ...pageTitles
};
