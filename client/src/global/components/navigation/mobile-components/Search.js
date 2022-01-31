import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import SearchMenu from "global/components/search/menu";
import { FrontendModeContext } from "helpers/contexts";
import withSettings from "hoc/withSettings";

class MobileSearch extends PureComponent {
  static propTypes = {
    closeNavigation: PropTypes.func
  };

  static contextType = FrontendModeContext;

  get isLibraryDisabled() {
    return this.props.settings.attributes.general.libraryDisabled;
  }

  render() {
    const scopeToProject =
      this.context.isStandalone ||
      Boolean(this.isLibraryDisabled && this.context.project);
    const projectId = scopeToProject ? this.context.project.id : null;

    return (
      <SearchMenu.Body
        onSubmit={this.props.closeNavigation}
        searchType={scopeToProject ? "project" : "library"}
        projectId={projectId}
        visibility={{ search: true }}
        className="nested-nav__search-menu"
      />
    );
  }
}

export default withSettings(MobileSearch);
