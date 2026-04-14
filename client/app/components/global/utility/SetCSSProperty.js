import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import debounce from "lodash/debounce";

export default class SetCSSProperty extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    measurement: PropTypes.oneOf(["width", "height"]),
    propertyName: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.measuredRef = React.createRef();
  }

  componentDidMount() {
    if (!this.measuredRef || !this.measuredRef.current) return null;

    this.setMeasuredProperty();

    this.debouncedResize = debounce(this.setMeasuredProperty, 300);
    window.addEventListener("resize", this.debouncedResize);
  }

  componentWillUnmount() {
    if (!this.measuredRef || !this.measuredRef.current) return null;

    this.resetMeasuredProperty();

    window.removeEventListener("resize", this.debouncedResize);
  }

  resetMeasuredProperty = () => {
    document.documentElement.style.setProperty(this.props.propertyName, `0px`);
  };

  setMeasuredProperty = () => {
    if (!this.measuredRef?.current) return;

    const measurement = this.measuredRef.current.getBoundingClientRect()[
      this.props.measurement
    ];
    document.documentElement.style.setProperty(
      this.props.propertyName,
      `${measurement}px`
    );
  };

  render() {
    return <div ref={this.measuredRef}>{this.props.children}</div>;
  }
}
