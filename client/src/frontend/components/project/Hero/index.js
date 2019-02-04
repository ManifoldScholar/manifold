import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import has from "lodash/has";
import orderBy from "lodash/orderBy";
import Cover from "./Cover";
import Meta from "./Meta";
import CalloutList from "./CalloutList";
import Social from "./Social";
import Credits from "./Credits";

export default class ProjectHero extends PureComponent {
  static displayName = "Project.Hero";

  static propTypes = {
    project: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      objectFit: true
    };

    this.bgImage = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    // only need to test for objectFit once, so if state.objectFit is already
    // false, don't test again
    if (!prevState.objectFit) return null;

    if (!this.bgImage || !this.bgImage.current) return null;
    // if browser doesn't recognize `objectFit` property, update state
    // this is used to set a background image on the hero rather than <img>
    const supports = this.bgImage.current.style.objectFit !== undefined;
    if (!supports) this.setState({ objectFit: false });
  }

  get darkMode() {
    return this.props.project.attributes.darkMode;
  }

  get backgroundImage() {
    return this.props.project.attributes.heroStyles;
  }

  get hasBackgroundImage() {
    return (
      this.backgroundImage.mediumLandscape &&
      this.backgroundImage.largeLandscape
    );
  }

  get coverSrc() {
    return this.props.project.attributes.coverStyles.medium;
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

  get showSocialBlock() {
    const services = ["twitter", "facebook", "instagram"];
    return (
      has(this.props.project.attributes, services) ||
      this.props.project.attributes.hashtag
    );
  }

  get credits() {
    return this.props.project.attributes.imageCreditsFormatted;
  }

  renderBgImage(blockClass) {
    const sizes = { retina: 2560, large: 1280, medium: 640 };

    return (
      <div
        style={{
          backgroundImage:
            !this.state.objectFit &&
            `url(${this.backgroundImage.largeLandscape})`
        }}
        className={`${blockClass}__bg-image-wrapper`}
        aria-hidden
      >
        <img
          ref={this.bgImage}
          srcSet={`
            ${this.backgroundImage.largeLandscape} ${sizes.large}w,
            ${this.backgroundImage.mediumLandscape} ${sizes.medium}w
          `}
          src={this.backgroundImage.largeLandscape}
          alt=""
          className={`${blockClass}__bg-image`}
          style={{ opacity: !this.state.objectFit ? 0 : 1 }}
        />
      </div>
    );
  }

  render() {
    const blockClass = "project-hero";
    const themeModifier =
      this.hasBackgroundImage || this.darkMode ? "dark" : "light";

    return (
      <section className={`${blockClass} ${blockClass}--${themeModifier}`}>
        <div className={`${blockClass}__inner`}>
          <div className={`${blockClass}__left-top-block`}>
            <Meta blockClass={blockClass} project={this.props.project} />
            {this.leftCallouts && this.leftCallouts.length > 0 && (
              <CalloutList
                blockClass={blockClass}
                callouts={this.leftCallouts}
                layoutClass={"inline"}
                visibilityClass={"desktop"}
              />
            )}
            {this.allCallouts && this.allCallouts.length > 0 && (
              <CalloutList
                blockClass={blockClass}
                callouts={this.allCallouts}
                layoutClass={"stacked"}
                visibilityClass={"mobile"}
              />
            )}
          </div>
          {this.showSocialBlock && (
            <div className={`${blockClass}__left-bottom-block`}>
              <Social blockClass={blockClass} project={this.props.project} />
            </div>
          )}
          <div className={`${blockClass}__right-top-block`}>
            <Cover blockClass={blockClass} project={this.props.project} />
            {this.rightCallouts && this.rightCallouts.length > 0 && (
              <CalloutList
                blockClass={blockClass}
                callouts={this.rightCallouts}
                layoutClass={"stacked"}
                visibilityClass={"desktop"}
              />
            )}
          </div>
          {this.credits && (
            <div className={`${blockClass}__right-bottom-block`}>
              <Credits blockClass={blockClass} copy={this.credits} />
            </div>
          )}
        </div>
        {this.hasBackgroundImage && this.renderBgImage(blockClass)}
      </section>
    );
  }
}
