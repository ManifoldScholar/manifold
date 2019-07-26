import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import orderBy from "lodash/orderBy";
import classNames from "classnames";
import Cover from "./Cover";
import Meta from "./Meta";
import CalloutList from "./CalloutList";
import Social from "./Social";
import Credits from "./Credits";
import Authorization from "helpers/authorization";
import Image from "./Image";
import Heading from "./Heading";
import { FrontendModeContext } from "helpers/contexts";

export default class ProjectHero extends PureComponent {
  static displayName = "Project.Hero";

  static propTypes = {
    project: PropTypes.object
  };

  static contextType = FrontendModeContext;

  constructor(props) {
    super(props);
    this.authorization = new Authorization();
    this.rightColRef = React.createRef();
    this.headingRef = React.createRef();
    this.state = {
      objectFit: true
    };

    this.bgImage = React.createRef();
    this.resizeId = null;
    this.breakpoint = 620;
  }

  componentDidMount() {
    this.addMarginToCoverIfStandalone();
    window.addEventListener("resize", this.handleResize);
  }

  componentDidUpdate(prevProps, prevState) {
    this.detectObjectFit(prevState);
    this.addMarginToCoverIfStandalone();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  addMarginToCoverIfStandalone() {
    if (!this.isStandalone) return;
    if (!this.rightColRef || !this.rightColRef.current) return;
    if (!this.headingRef || !this.headingRef.current) return;
    const height = this.headingRef.current.offsetHeight;
    this.rightColRef.current.style.marginTop = `${height}px`;
  }

  handleResize = () => {
    if (!this.isStandalone) return;

    if (this.resizeId) {
      window.cancelAnimationFrame(this.resizeId);
    }

    this.resizeId = window.requestAnimationFrame(() => {
      this.addMarginToCoverIfStandalone();
    });
  }

  detectObjectFit(prevState) {
    // only need to test for objectFit once, so if state.objectFit is already
    // false, don't test again
    if (!prevState.objectFit) return null;

    if (!this.bgImage || !this.bgImage.current) return null;
    // if browser doesn't recognize `objectFit` property, update state
    // this is used to set a background image on the hero rather than <img>
    const supports = this.bgImage.current.style.objectFit !== undefined;
    if (!supports) this.setState({ objectFit: false });
  }

  get lightMode() {
    if (this.hasBackgroundImage) return false;
    return !this.props.project.attributes.darkMode;
  }

  get backgroundImage() {
    return this.props.project.attributes.heroStyles;
  }

  get hasBackgroundImage() {
    return Boolean(
      this.backgroundImage.mediumLandscape &&
        this.backgroundImage.largeLandscape
    );
  }

  get isStandalone() {
    return this.context.isStandalone;
  }

  get showErrors() {
    return this.authorization.authorizeAbility({
      entity: this.props.project,
      ability: "update"
    });
  }

  get actionCallouts() {
    return this.props.project.relationships.actionCallouts;
  }

  get leftCallouts() {
    const filtered = this.actionCallouts.filter(
      callout => callout.attributes.location === "left"
    );

    return orderBy(
      filtered,
      ["attributes.button", "attributes.position"],
      ["desc", "asc"]
    );
  }

  get rightCallouts() {
    const filtered = this.actionCallouts.filter(
      callout => callout.attributes.location === "right"
    );

    return orderBy(
      filtered,
      ["attributes.button", "attributes.position"],
      ["desc", "asc"]
    );
  }

  get allCallouts() {
    return orderBy(
      this.actionCallouts,
      ["attributes.button", "attributes.location", "attributes.position"],
      ["desc", "asc", "asc"]
    );
  }

  get credits() {
    return this.props.project.attributes.imageCreditsFormatted;
  }

  render() {
    const blockClass = "project-hero";

    const containerClasses = classNames({
      [`${blockClass}`]: true,
      [`${blockClass}--dark`]: !this.lightMode,
      [`${blockClass}--light`]: this.lightMode,
      [`${blockClass}--standalone`]: this.isStandalone
    });

    return (
      <section className={containerClasses}>
        <div className={`${blockClass}__inner`}>
          <div className={`${blockClass}__left-top-block`}>
            <div ref={this.headingRef}>
              <Heading project={this.props.project} />
            </div>
            <Meta blockClass={blockClass} project={this.props.project} />
            <CalloutList
              blockClass={blockClass}
              callouts={this.leftCallouts}
              layoutClass={"inline"}
              showErrors={this.showErrors}
              visibilityClass={"desktop"}
            />
            <CalloutList
              blockClass={blockClass}
              callouts={this.allCallouts}
              layoutClass={"stacked"}
              showErrors={this.showErrors}
              visibilityClass={"mobile"}
            />
          </div>
          <Social
            wrapperClassName={`${blockClass}__left-bottom-block`}
            blockClass={blockClass}
            project={this.props.project}
          />
          <div
            ref={this.rightColRef}
            className={`${blockClass}__right-top-block`}
          >
            <Cover blockClass={blockClass} project={this.props.project} />
            <CalloutList
              blockClass={blockClass}
              callouts={this.rightCallouts}
              layoutClass={"stacked"}
              showErrors={this.showErrors}
              visibilityClass={"desktop"}
            />
          </div>
          <Credits
            wrapperClassName={`${blockClass}__right-bottom-block`}
            blockClass={blockClass}
            copy={this.credits}
          />
        </div>
        <Image
          {...this.props}
          backgroundImage={this.props.project.attributes.heroStyles}
        />
      </section>
    );
  }
}
