import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import SearchMenu from "global/components/search/menu";
import { FrontendModeContext } from "helpers/contexts";

export default class MobileSearch extends PureComponent {
  static propTypes = {
    closeNavigation: PropTypes.func
  };

  static contextType = FrontendModeContext;

  render() {
    const projectId = this.context.isLibrary ? null : this.context.project.id;
    return (
      <SearchMenu.Body
        onSubmit={this.props.closeNavigation}
        searchType={projectId ? "project" : "library"}
        projectId={projectId}
        visibility={{ search: true }}
        className="nested-nav__search-menu"
      />
    );
  }
}
