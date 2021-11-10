import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class SocialGithub extends Component {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stroke: PropTypes.string,
    fill: PropTypes.string,
    svgProps: PropTypes.object
  };

  static defaultProps = {
    className: "",
    size: "inherit",
    stroke: "currentColor",
    fill: "currentColor",
    svgProps: {}
  };

  get defaultHeight() {
    return 32;
  }

  get defaultWidth() {
    return 32;
  }

  get size() {
    return this.props.size;
  }

  get width() {
    if (this.size === null || this.size === "inherit") return null;
    if (this.size === "default") return this.defaultWidth;
    return this.size;
  }

  get height() {
    if (this.size === null || this.size === "inherit") return null;
    if (this.size === "default") return this.defaultHeight;
    return this.size;
  }

  get viewBox() {
    return "0 0 32 32";
  }

  get classes() {
    const { className } = this.props;
    return classnames("manicon-svg", className);
  }

  get fill() {
    return this.props.fill;
  }

  get stroke() {
    return this.props.stroke;
  }

  render() {
    const baseSvgProps = {
      xmlns: "http://www.w3.org/2000/svg",
      className: this.classes,
      width: this.width,
      height: this.height,
      viewBox: this.viewBox,
      fill: this.fill
    };

    const svgProps = Object.assign(baseSvgProps, this.props.svgProps);

    return (
      <svg {...svgProps}>
        <path d="M15.9993,2.00159996 C9.13239114,2.00240864 3.27956677,6.9832386 2.1804571,13.7616157 C1.08134743,20.5399928 5.06039116,27.1150541 11.5752,29.2857 C12.2745,29.4135 12.5301,28.9821 12.5301,28.6111 C12.5301,28.2786 12.5177,27.3979 12.5108,26.23 C8.61699998,27.0764 7.79539997,24.3532 7.79539997,24.3532 C7.53816774,23.50692 6.98704394,22.7803871 6.24139997,22.3046 C4.97049997,21.4363 6.33759997,21.4541 6.33759997,21.4541 C7.23641761,21.5784709 8.02744742,22.1109048 8.48099998,22.8968 C8.86445163,23.5942548 9.51071073,24.1095624 10.2760325,24.3281051 C11.0413544,24.5466477 11.8622748,24.4503028 12.5562,24.0605 C12.6197852,23.3502617 12.9350328,22.6861102 13.4451,22.1878 C10.3358,21.8361 7.06859997,20.6339 7.06859997,15.2699 C7.04775002,13.8787726 7.56343567,12.5330479 8.50859998,11.5121 C8.08152178,10.304845 8.13065696,8.98019772 8.64599998,7.80789997 C8.64599998,7.80789997 9.82069998,7.43149997 12.496,9.24369998 C14.7904357,8.61543368 17.2115643,8.61543368 19.506,9.24369998 C22.1783,7.43149997 23.3517,7.80789997 23.3517,7.80789997 C23.8679813,8.97984321 23.9180478,10.3045301 23.4917,11.5121 C24.4363501,12.533287 24.9514299,13.8790552 24.93,15.27 C24.93,20.6477 21.6572,21.8307 18.5383,22.1783 C19.2137924,22.8647258 19.5603336,23.8091855 19.4891,24.7696 C19.4891,26.6423 19.4712,28.1523 19.4712,28.6112 C19.4712,28.9849 19.7227,29.4205 20.4344,29.2831 C26.9462241,27.108247 30.9205158,20.5326779 29.818882,13.7562304 C28.7172482,6.97978287 22.8647088,2.00174244 15.9993,2.00159996" />
      </svg>
    );
  }
}
