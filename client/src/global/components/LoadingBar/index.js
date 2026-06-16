import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

class LoadingBar extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.timer = null;
    this.state = { status: 0 };
  }

  componentDidUpdate(prevProps) {
    if (!this.loader) return null;
    if (prevProps.loading) {
      if (this.props.loading) return null;
      this.loader.className = "loading-bar complete";
      this.timer = setTimeout(() => {
        this.loader.className = "loading-bar default";
      }, 800);
    } else {
      if (!this.props.loading) return null;
      this.loader.className = "loading-bar loading";
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  render() {
    return (
      <div>
        <div
          ref={loader => {
            this.loader = loader;
          }}
          className="loading-bar default"
        >
          {/* ARC solution. Informational image for screen readers. */}
          {/* Less noisy than role=status. Users can find this information if needed. */}
          {this.props.loading && (
            <div
              className="screen-reader-text"
              role="img"
              aria-label={this.props.t("common.loading_page")}
            />
          )}
          <div className="progress" />
        </div>
      </div>
    );
  }
}

export default withTranslation()(LoadingBar);
