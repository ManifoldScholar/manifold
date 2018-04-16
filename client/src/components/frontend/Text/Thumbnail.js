import React, { Component } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";
import Cover from "./Cover";
import FormattedDate from "components/global/FormattedDate";

export default class TextThumbnail extends Component {
  static displayName = "Text.Thumbnail";

  static propTypes = {
    text: PropTypes.object
  };

  renderSubtitle = text => {
    // if (!text.attributes.subtitle) return null;
    return <span className="subtitle">{text.attributes.subtitle}</span>;
  };

  render() {
    const text = this.props.text;

    // Temporary while icons are not getting link styling
    const styles = {
      color: "#52e3ac"
    };

    return (
      <div className="asset-thumb">
        <div className="asset-link">
          <Link to={lh.link("reader", this.props.text.attributes.slug)}>
            <figure className="asset-image">
              {text.attributes.age <= 30 ? (
                <i className="manicon manicon-new" />
              ) : null}
              <Cover text={this.props.text} />
            </figure>
          </Link>

          <div className="asset-description">
            <Link to={lh.link("reader", this.props.text.attributes.slug)}>
              <h3 className="asset-title">
                {text.attributes.title}
                {this.renderSubtitle(text)}
              </h3>
            </Link>
            <span className="asset-date">
              <FormattedDate
                prefix="Added"
                format="MMMM, YYYY"
                date={text.attributes.createdAt}
              />
            </span>

            <div className="asset-status">
              <ul className="asset-interactions">
                <li>
                  <div>
                    <i
                      className="manicon manicon-pencil-simple"
                      style={styles}
                    />
                    {text.attributes.annotationsCount}
                  </div>
                </li>
                <li>
                  <div>
                    <i className="manicon manicon-highlight" style={styles} />
                    {text.attributes.highlightsCount}
                  </div>
                </li>
                {/* <li>
                  <div>
                    <i className="manicon manicon-bookmark-outline" style={styles}></i>
                    {text.attributes.bookmarksCount}
                  </div>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
