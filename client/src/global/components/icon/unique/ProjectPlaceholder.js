import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class SVGProjectPlaceholder extends Component {
  static displayName = "SVG.ProjectPlaceholder";

  static propTypes = {
    color: PropTypes.string,
    ariaLabel: PropTypes.bool,
    mode: PropTypes.oneOf(["responsive", "small", "large"]),
    className: PropTypes.string,
    borderless: PropTypes.bool
  };

  static defaultProps = {
    mode: "responsive",
    ariaLabel: true,
    borderless: false
  };

  get blockClass() {
    return "project-thumb-placeholder";
  }

  get className() {
    return this.props.className;
  }

  get ariaLabel() {
    return this.props.ariaLabel ? "Default Project Thumbnail" : null;
  }

  get isResponsive() {
    return this.props.mode === "responsive";
  }

  small(className) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="100%"
        height="100%"
        className={this.classes(className)}
        aria-hidden={this.isResponsive}
      >
        {this.ariaLabel && <title>{this.ariaLabel}</title>}
        <g fill="none" fillRule="evenodd">
          <polygon
            className={`${this.blockClass}__tile`}
            fill="#CBF7E6"
            points="0 42 42 42 42 0 0 0"
          />
          <g
            className={`${this.blockClass}__illustration`}
            transform="translate(9 8)"
          >
            <g transform="translate(20.683 2.244)">
              <polygon points=".161 2.954 .161 21.013 1.612 23.598 3.06 21.013 3.06 2.954" />
              <path d="M3.06081501,21.012797 L0.161633021,21.012797" />
              <path
                strokeLinejoin="round"
                d="M0.162011257,2.95560225 L3.06119325,2.95560225 L3.06119325,1.53299812 C3.06119325,0.980713374 2.613478,0.532998124 2.06119325,0.532998124 L1.16201126,0.532998124 C0.609726507,0.532998124 0.162011257,0.980713374 0.162011257,1.53299812 L0.162011257,2.95560225 Z"
              />
            </g>
            <g transform="translate(.195 11.463)">
              <polygon points="14.898 .419 .985 .419 .985 11.282 8.141 11.282 8.141 14.378 10.844 11.282 14.898 11.282" />
              <path d="M12.5237854 3.46905816L3.32696735 3.46905816M12.5237854 8.00165403L3.32696735 8.00165403M12.5237854 5.73507242L3.32696735 5.73507242" />
            </g>
            <g transform="translate(.195 .195)">
              <path d="M11.8853223 5.12585966C11.8853223 6.3608015 10.8848871 7.36123677 9.64994522 7.36123677 8.41689456 7.36123677 7.41645929 6.3608015 7.41645929 5.12585966 7.41645929 3.89091782 8.41689456 2.89048255 9.64994522 2.89048255 10.8848871 2.89048255 11.8853223 3.89091782 11.8853223 5.12585966zM11.8853223 5.23573734L15.0417051 2.0793546C15.6109508 1.51010882 16.5849096 1.91293058 16.5849096 2.71857411M3.99814784 3.09718874L6.63067317.464663415C7.20181013-.106473546 8.17576886.2982394 8.17576886 1.10388293" />
              <path d="M5.22155347 5.12585966C5.22155347 6.3608015 4.2211182 7.36123677 2.98617636 7.36123677 1.7531257 7.36123677.752690432 6.3608015.752690432 5.12585966.752690432 3.89091782 1.7531257 2.89048255 2.98617636 2.89048255 4.2211182 2.89048255 5.22155347 3.89091782 5.22155347 5.12585966zM5.22155347 5.34334559L5.71136961 5.13720675C6.09906191 4.97267392 6.53781614 4.97267392 6.92739962 5.13720675L7.41532458 5.34334559" />
            </g>
          </g>
          {!this.props.borderless && (
            <g className={`${this.blockClass}__frame`} stroke="#828282">
              <polyline points="48 6 48 48 6 48" />
              <polyline points="45 3 45 45 3 45" />
              <polygon points="0 42 42 42 42 0 0 0" />
            </g>
          )}
        </g>
      </svg>
    );
  }

  large(className) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 134 134"
        width={134}
        height={134}
        className={this.classes(className)}
        role="img"
      >
        {this.ariaLabel && <title>{this.ariaLabel}</title>}
        <g fill="none" fillRule="evenodd">
          <g
            className={`${this.blockClass}__frame`}
            strokeWidth="1.5"
            transform="translate(2 2)"
          >
            <polyline points="124 6 124 124 6 124" />
            <polyline points="130 12 130 130 12 130" />
            <polygon points="0 118 118 118 118 0 0 0" />
          </g>
          <polygon
            className={`${this.blockClass}__tile`}
            points="0 102 102 102 102 0 0 0"
            transform="translate(10 10)"
          />
          <g
            className={`${this.blockClass}__illustration`}
            transform="translate(34 32)"
          >
            <g transform="translate(47.557 2.968)">
              <polyline
                className={`${this.blockClass}__illustration`}
                strokeWidth="1.5"
                points=".271 7.606 .271 50.893 3.747 57.089 7.221 50.893 7.221 7.606"
              />
              <path
                strokeWidth="1.5"
                d="M7.22166456 50.8926203L.271601266 50.8926203M.27135443 3.82883544L.27135443 2.02693671C.27135443.936746835 1.1558481.0522531646 2.24603797.0522531646L5.24673418.0522531646C6.33774684.0522531646 7.22141772.936746835 7.22141772 2.02693671L7.22141772 3.82883544"
              />
              <polygon
                strokeWidth="1.5"
                points=".272 7.606 7.222 7.606 7.222 3.829 .272 3.829"
              />
              <path
                strokeWidth="1.5"
                d="M3.74655063,11.5277975 L3.74655063,46.9708987"
              />
              <polygon points="2.183 54.3 3.747 57.089 5.311 54.3" />
            </g>
            <g strokeWidth="1.5" transform="translate(0 26)">
              <polygon points="34.054 .598 .703 .598 .703 26.635 17.859 26.635 17.859 34.057 24.336 26.635 34.054 26.635" />
              <path d="M28.3519304 7.9074557L6.30870253 7.9074557M28.3519304 18.7725759L6.30870253 18.7725759M28.3519304 13.3399747L6.30870253 13.3399747" />
            </g>
            <g strokeWidth="1.5">
              <path d="M27.3882848 11.8128038C27.3882848 14.7707152 24.9898671 17.1691329 22.0319557 17.1691329 19.0740443 17.1691329 16.6756266 14.7707152 16.6756266 11.8128038 16.6756266 8.85489241 19.0740443 6.45647468 22.0319557 6.45647468 24.9898671 6.45647468 27.3882848 8.85489241 27.3882848 11.8128038zM27.3882848 12.0765886L34.9537911 4.51108228C36.3196139 3.14608228 38.6546772 4.11285443 38.6546772 6.04475316M8.54099982 6.88421582L14.7943291.639221519C16.1601519-.726601266 18.4952152.240993671 18.4952152 2.17206962M11.4153165 12.3338734L12.5877848 11.8393797C13.52 11.4469114 14.5706962 11.4469114 15.5029114 11.8393797L16.6753797 12.3338734" />
              <path d="M11.4153165,11.8128038 C11.4153165,14.7707152 9.01689873,17.1691329 6.05898734,17.1691329 C3.10107595,17.1691329 0.702658228,14.7707152 0.702658228,11.8128038 C0.702658228,8.85489241 3.10107595,6.45647468 6.05898734,6.45647468 C9.01689873,6.45647468 11.4153165,8.85489241 11.4153165,11.8128038 Z" />
            </g>
          </g>
        </g>
      </svg>
    );
  }

  classes(type) {
    const colorModifier =
      !this.props.color || this.props.color === "sentary"
        ? "sentary"
        : this.props.color;

    return classNames(
      this.blockClass,
      this.className,
      `${this.blockClass}--${type}`,
      `${this.blockClass}--${colorModifier}`
    );
  }

  render() {
    const { mode } = this.props;
    let out;
    switch (mode) {
      case "large":
        out = this.large("all");
        break;

      case "small":
        out = this.small("all");
        break;

      default:
        out = (
          <>
            {this.large("desktop")}
            {this.small("mobile")}
          </>
        );
    }

    return out;
  }
}
