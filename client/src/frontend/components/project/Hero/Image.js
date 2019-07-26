import React from "react";

export default class ProjectHeroImage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      objectFit: true
    };
    this.bgImage = React.createRef();
  }

  get backgroundImage() {
    return this.props.backgroundImage;
  }

  get hasBackgroundImage() {
    return (
      this.backgroundImage.mediumLandscape &&
      this.backgroundImage.largeLandscape
    );
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

  render() {
    const sizes = { retina: 2560, large: 1280, medium: 640 };
    const blockClass = "project-hero";

    if (!this.hasBackgroundImage) return null;

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
}
