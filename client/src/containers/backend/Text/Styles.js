import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Dialog } from "components/backend";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import { Icon } from "components/global/SVG";
import FormattedDate from "components/global/FormattedDate";
import { stylesheetsAPI, requests } from "api";
import { notificationActions, entityStoreActions } from "actions";

const { request } = entityStoreActions;

export default class TextStylesContainer extends PureComponent {
  static displayName = "Text.Styles";

  static propTypes = {
    text: PropTypes.object,
    dispatch: PropTypes.func,
    refresh: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      confirmation: null
    };
  }

  handleDestroy = stylesheet => {
    const heading = "Are you sure you want to delete this stylesheet?";
    const message = "This action cannot be undone.";
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(
      () => {
        this.doDestroy(stylesheet);
        this.closeDialog();
      },
      () => {
        this.closeDialog();
      }
    );
  };

  closeDialog = () => {
    this.setState({ confirmation: null });
  };

  doDestroy = stylesheet => {
    const call = stylesheetsAPI.destroy(stylesheet.id);
    const options = { removes: stylesheet };
    const stylesheetRequest = request(
      call,
      requests.beStylesheetDestroy,
      options
    );
    this.props.dispatch(stylesheetRequest).promise.then(() => {
      this.notifyDestroy(stylesheet);
      this.props.refresh();
    });
  };

  notifyDestroy(stylesheet) {
    const notification = {
      level: 0,
      id: `STYLESHEET_DESTROYED_${stylesheet.id}`,
      heading: "The stylesheet has been deleted.",
      body: `${stylesheet.attributes.name} has passed into the endless night.`,
      expiration: 5000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  handleMoveDown = (event, stylesheet) => {
    event.preventDefault();
    this.updateStylesheetPosition(stylesheet, "down");
  };

  handleMoveUp = (event, stylesheet) => {
    event.preventDefault();
    this.updateStylesheetPosition(stylesheet, "up");
  };

  updateStylesheetPosition(stylesheet, newPos) {
    const changes = {
      attributes: { position: newPos }
    };
    const call = stylesheetsAPI.update(stylesheet.id, changes);
    const stylesheetRequest = request(call, requests.beStylesheetUpdate);
    this.props.dispatch(stylesheetRequest).promise.then(() => {
      this.props.refresh();
    });
  }

  render() {
    const { text } = this.props;
    const { stylesheets } = this.props.text.relationships;
    return (
      <div>
        {this.state.confirmation ? (
          <Dialog.Confirm {...this.state.confirmation} />
        ) : null}

        <section className="text-category-list-secondary">
          <div className="instructional-copy">
            <p>
              {`Stylesheets are applied to texts in the order listed below.
              "Ingested" stylesheets are part of the source document and are
              copied into Manifold (with some modification) during text
              ingestion. "User" stylesheets are those that have been created
              after the initial ingestion. To override styles in the source
              document, create a new stylesheet and move it to the bottom of the
              list.`}
            </p>
          </div>

          <div className="text-category">
            <header>
              <h4 className="category-title highlight">Stylesheets</h4>
            </header>
            <ul className="texts-group">
              {stylesheets.map((stylesheet, index, collection) => {
                return (
                  <li key={stylesheet.id}>
                    <div>
                      <Link
                        className="asset-thumb"
                        to={lh.link(
                          "BackendTextStylesheetEdit",
                          text.id,
                          stylesheet.id
                        )}
                      >
                        <figure className="asset-image">
                          <div className="asset-image-placeholder">
                            <Icon.ResourceDocument size={50} />
                          </div>
                        </figure>
                        <div className="asset-description">
                          <h3 className="asset-title">
                            {stylesheet.attributes.name}
                            <span className="subtitle" />
                          </h3>
                          <span className="asset-date">
                            <FormattedDate
                              prefix="Added"
                              format="MMMM, YYYY"
                              date={stylesheet.attributes.createdAt}
                            />
                          </span>
                          <span className="asset-state">
                            {stylesheet.attributes.ingested
                              ? "Ingested"
                              : "User"}
                          </span>
                        </div>
                      </Link>
                      <div className="text-category-list-utility">
                        <Link
                          className="button"
                          to={lh.link(
                            "BackendTextStylesheetEdit",
                            text.id,
                            stylesheet.id
                          )}
                        >
                          Edit
                        </Link>
                        {index !== 0 ? (
                          <button
                            onClick={event => {
                              this.handleMoveUp(event, stylesheet);
                            }}
                          >
                            <span className="screen-reader-text">
                              Move Stylesheet up
                            </span>
                            <i
                              className="manicon manicon-arrow-up"
                              aria-hidden="true"
                            />
                          </button>
                        ) : (
                          <button
                            style={{ visibility: "hidden" }}
                            onClick={event => {
                              this.handleMoveUp(event, stylesheet);
                            }}
                          >
                            <span className="screen-reader-text">
                              Move Stylesheet up
                            </span>
                            <i
                              className="manicon manicon-arrow-up"
                              aria-hidden="true"
                            />
                          </button>
                        )}
                        {index + 1 < collection.length ? (
                          <button
                            onClick={event => {
                              this.handleMoveDown(event, stylesheet);
                            }}
                          >
                            <span className="screen-reader-text">
                              Move Stylesheet down
                            </span>
                            <i
                              className="manicon manicon-arrow-down"
                              aria-hidden="true"
                            />
                          </button>
                        ) : (
                          <button
                            onClick={event => {
                              this.handleMoveDown(event, stylesheet);
                            }}
                            style={{ visibility: "hidden" }}
                          >
                            <span className="screen-reader-text">
                              Move Stylesheet down
                            </span>
                            <i
                              className="manicon manicon-arrow-down"
                              aria-hidden="true"
                            />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            this.handleDestroy(stylesheet);
                          }}
                        >
                          <span className="screen-reader-text">
                            Delete Stylesheet
                          </span>
                          <i className="manicon manicon-x" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <div className="buttons-icon-horizontal">
          <Link
            className="button-icon-secondary"
            to={lh.link("BackendTextStylesheetNew", text.id)}
          >
            <i className="manicon manicon-plus" aria-hidden="true" />
            Add a New Stylesheet
          </Link>
        </div>
      </div>
    );
  }
}
