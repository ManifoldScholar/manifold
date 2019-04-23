import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import withPluginReplacement from "hoc/with-plugin-replacement";
import BlurOnLocationChange from "hoc/blur-on-location-change";
import Utility from "global/components/utility";
import Logo from "./Logo";
import Search from "./Search";
import Copyright from "./Copyright";
import PostFooter from "./PostFooter";
import Navigation from "./Navigation";
import FooterLogic from "./FooterLogic";


class Footer extends Component {
  static displayName = "Layout.Footer";

  static propTypes = {
    commonActions: PropTypes.object,
    authentication: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
    pages: PropTypes.array,
    settings: PropTypes.shape({
      attributes: PropTypes.shape({
        general: PropTypes.object,
        theme: PropTypes.object,
        oauth: PropTypes.object,
        pressLogoStyles: PropTypes.object,
        pressLogoFooterStyles: PropTypes.object,
        copyrightFormatted: PropTypes.string
      })
    })
  };

  static defaultProps = {
    pages: [],
    history: {
      push: () => {}
    }
  };

  render() {
    const { settings } = this.props;

    return (
      <BlurOnLocationChange location={this.props.location}>
        <footer className="footer-browse">
          <FooterLogic pressLogo={settings.attributes.pressLogoFooterStyles}>
            {searchPosition => (
              <React.Fragment>
                <section className="footer-primary">
                  <div className="container flush">
                    <div className="flex-row">
                      <div className="right">
                      { searchPosition === "right"
                        && <Search push={this.props.history.push} />
                      }
                      { searchPosition === "left"
                        &&  <Logo
                              pressLogo={settings.attributes.pressLogoFooterStyles}
                              pressSite={settings.attributes.general.pressSite}
                              />
                        }
                      </div>
                      <div className="rel left">
                        <Navigation
                          commonActions={this.props.commonActions}
                          pages={this.props.pages}
                          settings={settings}
                          authentication={this.props.authentication}
                        />
                        { searchPosition === "left"
                          && <Search push={this.props.history.push} />
                        }
                      </div>
                    </div>
                  </div>
                </section>
                <Copyright settings={settings} />
                <PostFooter searchPosition={searchPosition} />
              </React.Fragment>
            )}
          </FooterLogic>
        </footer>
      </BlurOnLocationChange>
    );
  }
}

export default withRouter(
  withPluginReplacement(Footer, "Frontend.Components.Layout.Footer")
);
