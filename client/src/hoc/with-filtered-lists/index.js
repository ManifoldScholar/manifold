import withFilters from "./hoc";
import projectFilters from "./project-filters";
import makerFilters from "./maker-filters";
import eventFilters from "./event-filters";
import resourceCollectionFilters from "./resource-collection-filters";
import resourceFilters from "./resource-filters";
import userFilters from "./user-filters";
import keywordFilter from "./keyword-filter";

export default withFilters;

export {
  projectFilters,
  makerFilters,
  eventFilters,
  resourceCollectionFilters,
  resourceFilters,
  userFilters,
  keywordFilter
};
