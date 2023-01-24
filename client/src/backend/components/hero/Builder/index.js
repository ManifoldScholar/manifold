import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { UIDConsumer } from "react-uid";
import Block from "./Block";
import Forms from "./forms";
import { projectsAPI } from "api";
import Drawer from "global/containers/drawer";
import ActionCallouts from "./ActionCallouts";
import SectionLabel from "global/components/form/SectionLabel";
import { withTranslation } from "react-i18next";
import * as Styled from "./styles";

import withConfirmation from "hoc/withConfirmation";

class Builder extends PureComponent {
  static displayName = "Hero.Builder";

  static propTypes = {
    include: PropTypes.arrayOf(
      PropTypes.oneOf([
        "projectDescription",
        "journalDescription",
        "actionCallouts",
        "social"
      ])
    ),
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
    withDarkMode: PropTypes.bool,
    t: PropTypes.func,
    confirm: PropTypes.func
  };

  static defaultProps = {
    include: [],
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

  get defaultModelLabel() {
    return this.props.t("glossary.project_one");
  }

  constructor(props) {
    super(props);
    this.state = {
      drawer: null,
      formDirty: false,
      actionCalloutsOpen: false
    };
  }

  onDrawerClose = () => {
    if (this.state.formDirty) {
      const heading = this.props.t("messages.confirm");
      const message = this.props.t("messages.unsaved_changes");
      return this.props.confirm(heading, message, () =>
        this.setState({ drawer: null })
      );
    }
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

  openProjectDescriptionDrawer = () => {
    this.setState({ drawer: Forms.ProjectDescription });
  };

  openJournalDescriptionDrawer = () => {
    this.setState({ drawer: Forms.JournalDescription });
  };

  openSocialDrawer = () => {
    this.setState({ drawer: Forms.Social });
  };

  toggleActionCallouts = () => {
    this.setState({ actionCalloutsOpen: !this.state.actionCalloutsOpen });
  };

  render() {
    const { include, modelLabel, t } = this.props;
    const DrawerContents = this.drawerComponent;

    return (
      <UIDConsumer name={id => `hero-builder-${id}`}>
        {id => (
          <>
            <section className="hero-builder">
              <div
                role="group"
                aria-labelledby={`${id}-header`}
                aria-describedby={`${id}-instructions`}
              >
                <SectionLabel
                  label={t("layout.hero_block")}
                  id={`${id}-header`}
                />
                <Styled.Instructions id={`${id}-instructions`}>
                  {t("layout.hero_block_instructions", {
                    entity: modelLabel ?? this.defaultModelLabel
                  })}
                </Styled.Instructions>

                {include.includes("projectDescription") && (
                  <Block
                    title={t("layout.description_and_images")}
                    description={t("layout.description_and_images_description")}
                    onEdit={this.openProjectDescriptionDrawer}
                    ariaControls={`${id}-drawer`}
                    ariaExpanded={
                      this.state.drawer === Forms.ProjectDescription
                    }
                  />
                )}
                {include.includes("journalDescription") && (
                  <Block
                    title={t("layout.description_and_images")}
                    description={t("layout.description_and_images_description")}
                    onEdit={this.openJournalDescriptionDrawer}
                    ariaControls={`${id}-drawer`}
                    ariaExpanded={
                      this.state.drawer === Forms.JournalDescription
                    }
                  />
                )}
                {include.includes("actionCallouts") && (
                  <Block
                    title={t("layout.calls_to_action")}
                    description={t("layout.calls_to_action_description")}
                  >
                    {this.props.actionCallouts && (
                      <ActionCallouts
                        refresh={this.props.refreshActionCallouts}
                        dispatch={this.props.dispatch}
                        model={this.props.model}
                        actionCalloutSlots={this.props.actionCalloutSlots}
                        actionCallouts={this.props.actionCallouts}
                        actionCalloutNewRoute={this.props.actionCalloutNewRoute}
                        actionCalloutEditRoute={
                          this.props.actionCalloutEditRoute
                        }
                        actionCalloutsResponse={
                          this.props.actionCalloutsResponse
                        }
                      />
                    )}
                  </Block>
                )}
                {include.includes("social") && (
                  <Block
                    title={t("layout.social_links")}
                    description={t("layout.social_links_description")}
                    onEdit={this.openSocialDrawer}
                    ariaControls={`${id}-drawer`}
                    ariaExpanded={this.state.drawer === Forms.Social}
                  />
                )}
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
                  modelLabel={modelLabel ?? this.defaultModelLabel}
                  setDirty={val => this.setState({ formDirty: val })}
                />
              ) : null}
            </Drawer.Wrapper>
          </>
        )}
      </UIDConsumer>
    );
  }
}

export default withTranslation()(withConfirmation(Builder));
