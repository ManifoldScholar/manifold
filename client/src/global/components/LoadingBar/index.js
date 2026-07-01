import React, { Component } from "react";
import PropTypes from "prop-types";
import { Trans } from "react-i18next";

export default class LoadingBar extends Component {
  static propTypes = {
    loading: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.timer = null;
    this.textTimer = null;
    this.state = { status: 0, showLoadingText: false };
  }

  componentDidUpdate(prevProps) {
    if (!this.loader) return null;
    if (prevProps.loading) {
      if (this.props.loading) return null;
      this.clearTextTimer();
      this.setState({ showLoadingText: false });
      this.loader.className = "loading-bar complete";
      this.timer = setTimeout(() => {
        this.loader.className = "loading-bar default";
      }, 800);
    } else {
      if (!this.props.loading) return null;
      this.loader.className = "loading-bar loading";
      this.textTimer = setTimeout(() => {
        this.setState({ showLoadingText: true });
      }, 1000);
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.clearTextTimer();
  }

  clearTextTimer() {
    if (this.textTimer) {
      clearTimeout(this.textTimer);
      this.textTimer = null;
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
          role="status"
        >
          <div className="progress" />
          {this.state.showLoadingText ? (
            <Trans i18nKey="common.loading_page" />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
