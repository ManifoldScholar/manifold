import React, { PureComponent } from "react";
import { uiFrontendModeActions } from "actions";
import { FrontendModeContext } from "helpers/contexts";
import connectAndFetch from "utils/connectAndFetch";
import withSettings from "hoc/withSettings";
import queryString from "query-string";

class CheckFrontendMode extends PureComponent {
  static contextType = FrontendModeContext;

  static mapStateToProps = state => {
    return {
      frontendMode: state.ui.transitory.frontendMode
    };
  };

  componentDidMount() {
    this.log("componentDidMount");
    this.checkStandaloneMode(this.props.project);
    if (this.props.isProjectHomePage) this.setIsProjectHomepage();
    if (this.props.isProjectSubpage) this.setIsProjectSubpage();
  }

  componentDidUpdate(prevProps) {
    this.log("componentDidUpdate");
    if (
      this.sameProject(prevProps, this.props) &&
      this.sameFrontendMode(prevProps, this.props)
    )
      return;
    this.checkStandaloneMode(this.props.project);
  }

  componentWillUnmount() {
    this.log("componentWillUnmount");
    this.props.dispatch(uiFrontendModeActions.setFrontendModeToLibrary());
  }

  get project() {
    return this.props.project;
  }

  get settings() {
    return this.props.settings;
  }

  get projectStandaloneMode() {
    if (!this.project) return "disabled";
    return this.project.attributes.standaloneMode;
  }

  get canShowStandalone() {
    return this.projectStandaloneMode !== "disabled";
  }

  get isLibraryDisabled() {
    if (!this.project) return false;
    return this.settings.attributes.general.libraryDisabled;
  }

  get allStandalone() {
    if (!this.project) return false;
    return this.settings.attributes.general.allStandalone;
  }

  get isStandaloneEnforced() {
    return this.projectStandaloneMode === "enforced";
  }

  get canOverridePressHeader() {
    if (!this.project) return false;
    return Boolean(this.project.attributes.standaloneModePressBarText);
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

  setProjectContext() {
    const project = this.project;
    if (!project) return;
    this.props.dispatch(
      uiFrontendModeActions.setFrontendModeProjectContext({
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

  sameFrontendMode(prevProps, props) {
    const { frontendMode: prevFrontendMode } = prevProps;
    const { frontendMode: currentFrontendMode } = props;
    if (prevFrontendMode === currentFrontendMode) return true;
    return prevFrontendMode.isStandalone === currentFrontendMode.isStandalone;
  }

  sameProject(prevProps, props) {
    const { project: prevProject } = prevProps;
    const { project: currentProject } = props;
    if (prevProject === currentProject) return true;
    return (
      prevProject &&
      prevProject.id &&
      currentProject &&
      prevProject.id === currentProject.id
    );
  }

  // Look, this component is difficult to debug.
  log(arg, label = "") {
    /* eslint-disable no-constant-condition */
    /* eslint-disable no-console */
    if (false) console.log(arg, `${this.props.debugLabel}: ${label}`);
    /* eslint-enable no-constant-condition */
    /* eslint-enable no-console */
  }

  checkStandaloneMode(project) {
    this.log(this.project, "the project");
    this.log(this.canShowStandalone, "canShowStandalone?");
    this.log("mounting, checking standalone mode");
    this.log(this.isStandaloneEnforced, "isStandaloneEnforced?");
    this.log(this.lastStandaloneId, "lastStandaloneId");
    this.log(this.standaloneModeRequested, "standaloneModeRequested");
    if (this.isLibraryDisabled && this.allStandalone)
      return this.engageStandaloneMode();
    if (this.isStandaloneEnforced) return this.engageStandaloneMode();
    if (this.canShowStandalone && this.lastStandaloneId === project.id)
      return this.engageStandaloneMode();
    if (this.canShowStandalone && this.standaloneModeRequested)
      return this.engageStandaloneMode();
    return this.setProjectContext();
  }

  render() {
    return null;
  }
}

export default connectAndFetch(withSettings(CheckFrontendMode));
