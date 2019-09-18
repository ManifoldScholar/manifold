import React, { PureComponent } from "react";
import { uiFrontendModeActions } from "actions";
import { FrontendModeContext } from "helpers/contexts";
import connectAndFetch from "utils/connectAndFetch";
import queryString from "query-string";

class CheckFrontendMode extends PureComponent {
  static contextType = FrontendModeContext;

  static mapStateToProps = state => {
    return {
      frontendMode: state.ui.transitory.frontendMode
    };
  };

  componentDidMount() {
    const { project } = this.props;
    this.checkStandaloneMode(null, project);
    if (this.props.isProjectHomePage) this.setIsProjectHomepage();
    if (this.props.isProjectSubpage) this.setIsProjectSubpage();
  }

  componentDidUpdate(prevProps) {
    const { project } = this.props;
    this.checkStandaloneMode(prevProps.project, project);
  }

  componentWillUnmount() {
    this.log("unmounting, setting mode to library");
    this.props.dispatch(uiFrontendModeActions.setFrontendModeToLibrary());
  }

  get project() {
    return this.props.project;
  }

  get projectStandaloneMode() {
    if (!this.project) return "disabled";
    return this.project.attributes.standaloneMode;
  }

  get canShowStandalone() {
    return this.projectStandaloneMode !== "disabled";
  }

  get isStandaloneEnforced() {
    return this.projectStandaloneMode === "enforced";
  }

  setIsProjectHomepage() {
    this.props.dispatch(uiFrontendModeActions.isProjectHomepage());
  }

  setIsProjectSubpage() {
    this.props.dispatch(uiFrontendModeActions.isProjectSubpage());
  }

  engageStandaloneMode() {
    this.log("engaging standalone mode");
    const project = this.project;
    this.props.dispatch(
      uiFrontendModeActions.setFrontendModeToStandalone({
        project
      })
    );
  }

  get lastStandaloneId() {
    return this.props.frontendMode.lastStandaloneId;
  }

  get standaloneModeRequested() {
    const { search } = this.props.location;
    const query = queryString.parse(search);
    return query.mode === "standalone";
  }

  sameProject(prevProject, project) {
    if (prevProject === project) return true;
    if (
      prevProject &&
      prevProject.id &&
      project &&
      prevProject.id === project.id
    )
      return true;
    return false;
  }

  log(arg, label = "") {
    /* eslint-disable no-constant-condition */
    /* eslint-disable no-console */
    if (false) console.log(arg, `${this.props.debugLabel}: ${label}`);
    /* eslint-enable no-constant-condition */
    /* eslint-enable no-console */
  }

  checkStandaloneMode(prevProject, project) {
    if (!this.canShowStandalone) return;
    if (this.sameProject(prevProject, project)) return;

    this.log("mounting, checking standalone mode");
    this.log(this.canShowStandalone, "canShowStandalone?");
    this.log(this.sameProject(prevProject, project), "sameProject?");
    this.log(this.isStandaloneEnforced, "isStandaloneEnforced?");
    this.log(this.lastStandaloneId, "lastStandaloneId");
    this.log(this.standaloneModeRequested, "standaloneModeRequested");
    this.log(this.props, "props");

    if (this.isStandaloneEnforced) return this.engageStandaloneMode();
    if (this.canShowStandalone && this.lastStandaloneId === project.id)
      return this.engageStandaloneMode();
    if (this.canShowStandalone && this.standaloneModeRequested)
      return this.engageStandaloneMode();
  }

  render() {
    return null;
  }
}

export default connectAndFetch(CheckFrontendMode);
