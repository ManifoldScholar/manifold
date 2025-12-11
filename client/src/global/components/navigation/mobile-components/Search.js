import PropTypes from "prop-types";
import SearchMenu from "global/components/search/menu";
import { useFrontendModeContext, useSettings } from "hooks";

export default function MobileSearch({ closeNavigation }) {
  const context = useFrontendModeContext();
  const settings = useSettings();

  const isLibraryDisabled = settings?.attributes?.general?.libraryDisabled;
  const scopeToProject =
    context.isStandalone || Boolean(isLibraryDisabled && context.project);
  const projectId = scopeToProject ? context.project?.id : null;

  return (
    <SearchMenu.Body
      afterSubmit={closeNavigation}
      searchType={scopeToProject ? "project" : "library"}
      projectId={projectId}
      visibility={{ search: true }}
      className="nested-nav__search-menu"
    />
  );
}

MobileSearch.displayName = "Navigation.Mobile.Search";

MobileSearch.propTypes = {
  closeNavigation: PropTypes.func
};
