/* eslint-disable import/extensions */
import glossary from "./json/glossary.json";
import actions from "./json/actions.json";
import placeholders from "./json/placeholders.json";
import forms from "./json/forms.json";
import common from "./json/common.json";
import counts from "./json/counts.json";
import errors from "./json/errors.json";
import messages from "./json/messages.json";
import metadata from "./json/metadata.json";
import navigation from "./json/navigation.json";
import pages from "./json/pages.json";
import reader from "./json/reader.json";
import utility from "./json/utility.json";
import resources from "./json/resources.json";
import other from "./json/en.json";
import enUS from "date-fns/locale/en-US";
import backend from "./json/backend.json";
import backendEntities from "./json/backend-entities";

export default {
  translation: {
    ...other,
    ...glossary,
    ...actions,
    ...placeholders,
    ...forms,
    ...common,
    ...counts,
    ...errors,
    ...messages,
    ...metadata,
    ...navigation,
    ...pages,
    ...reader,
    ...utility,
    ...resources,
    ...backend,
    backend_entities: backendEntities,
    date_fns: enUS
  }
};
