import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Block from "./Block";
import Forms from "./forms";
import Drawer from "global/containers/drawer";
import ActionCallouts from "./ActionCallouts";

export default class Builder extends PureComponent {
  static displayName = "Project.Hero.Builder";

  static propTypes = {
    project: PropTypes.object.isRequired,
    actionCallouts: PropTypes.array,
    actionCalloutsResponse: PropTypes.object,
    refresh: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
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

  get project() {
    return this.props.project;
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
      <React.Fragment>
        <section className="hero-builder form-secondary">
          <div className="form-section">
            <header className="form-section-label">
              <h2>Hero Block</h2>
            </header>
            <span className="instructions">
              The Hero Block is the top of your project page. Customize its
              content, layout, and settings here.
            </span>

            <Block
              title="Description + Images"
              description="Description Text, Cover Art, and Background Image"
              onEdit={this.openDescriptionDrawer}
            />
            <Block
              title="Calls-to-Action"
              description="Buttons and links to related resources"
              onEdit={this.toggleActionCallouts}
              open={this.isActionCalloutsOpen}
            >
              {this.props.actionCallouts && (
                <ActionCallouts
                  refresh={this.props.refresh}
                  dispatch={this.props.dispatch}
                  project={this.props.project}
                  actionCallouts={this.props.actionCallouts}
                  actionCalloutsResponse={this.props.actionCalloutsResponse}
                />
              )}
            </Block>
            <Block
              title="Social Links"
              description="Links to social platforms and hashtag"
              onEdit={this.openSocialDrawer}
            />
          </div>
        </section>
        <Drawer.Wrapper
          lockScroll="always"
          lockScrollClickCloses={false}
          closeCallback={this.onDrawerClose}
          open={this.isDrawerOpen}
          style="backend"
        >
          {this.isDrawerOpen ? <DrawerContents project={this.project} /> : null}
        </Drawer.Wrapper>
      </React.Fragment>
    );
  }
}
