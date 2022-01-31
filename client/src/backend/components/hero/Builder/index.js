import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { UIDConsumer } from "react-uid";
import Block from "./Block";
import Forms from "./forms";
import { projectsAPI } from "api";
import Drawer from "global/containers/drawer";
import ActionCallouts from "./ActionCallouts";
import SectionLabel from "global/components/form/SectionLabel";

export default class Builder extends PureComponent {
  static displayName = "Hero.Builder";

  static propTypes = {
    model: PropTypes.object.isRequired,
    api: PropTypes.object,
    modelLabel: PropTypes.string,
    failureRedirectRoute: PropTypes.string,
    actionCalloutEditRoute: PropTypes.string,
    actionCalloutNewRoute: PropTypes.string,
    actionCallouts: PropTypes.array,
    actionCalloutsResponse: PropTypes.object,
    actionCalloutSlots: PropTypes.array,
    refreshActionCallouts: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    withDarkMode: PropTypes.bool
  };

  static defaultProps = {
    modelLabel: "project",
    api: projectsAPI,
    actionCalloutSlots: [
      "left-button",
      "left-link",
      "right-button",
      "right-link"
    ],
    failureRedirectRoute: "backendProject",
    actionCalloutEditRoute: "backendProjectActionCalloutEdit",
    actionCalloutNewRoute: "backendProjectActionCalloutNew"
  };

  constructor(props) {
    super(props);
    this.state = {
      drawer: null,
      actionCalloutsOpen: false
    };
  }

  onDrawerClose = () => {
    this.setState({ drawer: null });
  };

  get model() {
    return this.props.model;
  }

  get isDrawerOpen() {
    return this.state.drawer !== null;
  }

  get isActionCalloutsOpen() {
    return this.state.actionCalloutsOpen;
  }

  get drawerComponent() {
    if (!this.isDrawerOpen) return null;
    return this.state.drawer;
  }

  openDescriptionDrawer = () => {
    this.setState({ drawer: Forms.Description });
  };

  openSocialDrawer = () => {
    this.setState({ drawer: Forms.Social });
  };

  toggleActionCallouts = () => {
    this.setState({ actionCalloutsOpen: !this.state.actionCalloutsOpen });
  };

  render() {
    const DrawerContents = this.drawerComponent;

    return (
      <UIDConsumer name={id => `hero-builder-${id}`}>
        {id => (
          <>
            <section className="hero-builder form-secondary">
              <div
                className="form-section form-section--primary"
                role="group"
                aria-labelledby={`${id}-header`}
                aria-describedby={`${id}-instructions`}
              >
                <SectionLabel label="Hero Block" id={`${id}-header`} />
                <span id={`${id}-instructions`} className="instructions">
                  {`The Hero Block is the top of your ${this.props.modelLabel} page. Customize its
                  content, layout, and settings here.`}
                </span>

                <Block
                  title="Description + Images"
                  description="Description Text, Cover Art, and Background Image"
                  onEdit={this.openDescriptionDrawer}
                  ariaControls={`${id}-drawer`}
                  ariaExpanded={this.state.drawer === Forms.Description}
                />
                <Block
                  title="Calls-to-Action"
                  description="Buttons and links to related resources"
                >
                  {this.props.actionCallouts && (
                    <ActionCallouts
                      refresh={this.props.refreshActionCallouts}
                      dispatch={this.props.dispatch}
                      model={this.props.model}
                      actionCalloutSlots={this.props.actionCalloutSlots}
                      actionCallouts={this.props.actionCallouts}
                      actionCalloutNewRoute={this.props.actionCalloutNewRoute}
                      actionCalloutEditRoute={this.props.actionCalloutEditRoute}
                      actionCalloutsResponse={this.props.actionCalloutsResponse}
                    />
                  )}
                </Block>
                <Block
                  title="Social Links"
                  description="Links to social platforms and hashtag"
                  onEdit={this.openSocialDrawer}
                  ariaControls={`${id}-drawer`}
                  ariaExpanded={this.state.drawer === Forms.Social}
                />
              </div>
            </section>
            <Drawer.Wrapper
              lockScroll="always"
              lockScrollClickCloses={false}
              closeCallback={this.onDrawerClose}
              open={this.isDrawerOpen}
              context="backend"
              id={`${id}-drawer`}
            >
              {this.isDrawerOpen ? (
                <DrawerContents
                  api={this.props.api}
                  failureRedirectRoute={this.props.failureRedirectRoute}
                  actionCalloutEditRoute={this.props.actionCalloutEditRoute}
                  model={this.model}
                  withDarkMode={this.props.withDarkMode}
                  modelLabel={this.props.modelLabel}
                />
              ) : null}
            </Drawer.Wrapper>
          </>
        )}
      </UIDConsumer>
    );
  }
}
