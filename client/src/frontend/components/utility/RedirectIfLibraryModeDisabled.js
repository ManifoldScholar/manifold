import React, { Component } from "react";
import PropTypes from "prop-types";
import withSettings from "hoc/withSettings";
import { Route } from "react-router-dom";

class RedirectIfLibraryModeDisabled extends Component {
  static displayName = "Utility.RedirectIfLibraryModeDisabled";

  get settings() {
    return this.props.settings;
  }

  get libraryModeDisabled() {
    if (!this.settings) return false;
    if (!this.redirectUrl) return false;
    return this.settings.attributes.general.libraryDisabled;
  }

  get redirectUrl() {
    const { general } = this.settings.attributes;
    if (this.props.isHome) return general.homeRedirectUrl;
    return this.settings.attributes.general.libraryRedirectUrl;
  }

  render() {
    if (this.libraryModeDisabled)
      return (
        <Route
          render={({ staticContext }) => {
            if (__SERVER__) {
              staticContext.url = this.redirectUrl;
            } else {
              window.location = this.redirectUrl;
            }
            return null;
          }}
        />
      );
    return null;
  }
}

export default withSettings(RedirectIfLibraryModeDisabled);
