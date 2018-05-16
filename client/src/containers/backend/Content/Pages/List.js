import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Dialog } from "components/backend";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import { Resource } from "components/frontend";
import { FormattedDate } from "components/global";
import { HigherOrder } from "containers/global";
import { pagesAPI, requests } from "api";
import { notificationActions, entityStoreActions } from "actions";
import connectAndFetch from "utils/connectAndFetch";
import entityUtils from "utils/entityUtils";

const { select } = entityUtils;
const { request } = entityStoreActions;

class PagesDashboardContainer extends PureComponent {
  static displayName = "Pages.Dashboard";

  static fetchData = (getState, dispatch) => {
    const pages = request(pagesAPI.index(), requests.gPages);
    const { promise: one } = dispatch(pages);
    return Promise.all([one]);
  };

  static mapStateToProps = state => {
    return {
      pages: select(requests.gPages, state.entityStore)
    };
  };

  static propTypes = {
    pages: PropTypes.array,
    dispatch: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
  }

  handleDestroy = page => {
    const heading = "Are you sure you want to delete this page?";
    const message = "This action cannot be undone.";
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(
      () => {
        this.doDestroy(page);
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

  doDestroy = page => {
    const call = pagesAPI.destroy(page.id);
    const options = { removes: page };
    const pageRequest = request(call, requests.bePageDestroy, options);
    this.props.dispatch(pageRequest).promise.then(() => {
      this.notifyDestroy(page);
    });
  };

  notifyDestroy(page) {
    const notification = {
      level: 0,
      id: `PAGE_DESTROYED_${page.id}`,
      heading: "The page has been deleted.",
      body: `${page.attributes.title} has passed into the endless night.`,
      expiration: 5000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  render() {
    const { pages } = this.props;

    return (
      <div>
        {this.state.confirmation ? (
          <Dialog.Confirm {...this.state.confirmation} />
        ) : null}

        <section className="text-category-list-secondary">
          <div className="text-category">
            <header>
              <h4 className="category-title highlight">Pages</h4>
            </header>
            <div className="instructional-copy margin-top">
              <p>
                {`Pages can be used to offer content related to your Manifold installation.
              For example, you might create an "about" page in the header. Or, you could
              use pages to setup links to a privacy policy or terms of service in the
              footer.`}
              </p>
            </div>
            <ul className="texts-group">
              {pages.map(page => {
                return (
                  <li key={page.id}>
                    <div>
                      <Link
                        className="asset-thumb"
                        to={lh.link("backendContentPage", page.id)}
                      >
                        <figure className="asset-image">
                          <div className="asset-image-placeholder">
                            <Resource.Icon.Document />
                          </div>
                        </figure>
                        <div className="asset-description">
                          <h3 className="asset-title">
                            {page.attributes.title}
                            <span className="subtitle" />
                          </h3>
                          <span className="asset-date">
                            <FormattedDate
                              prefix="Updated"
                              format="MM/DD/YYYY"
                              date={page.attributes.updatedAt}
                            />
                          </span>
                          {page.attributes.hidden ? (
                            <span className="asset-state">{"hidden"}</span>
                          ) : null}
                        </div>
                      </Link>
                      <div className="text-category-list-utility">
                        <HigherOrder.Authorize entity={page} ability="update">
                          <Link
                            className="button"
                            to={lh.link("backendContentPage", page.id)}
                          >
                            Edit
                          </Link>
                        </HigherOrder.Authorize>
                        <HigherOrder.Authorize entity={page} ability="delete">
                          <button
                            onClick={() => {
                              this.handleDestroy(page);
                            }}
                          >
                            <span className="screen-reader-text">
                              Delete page
                            </span>
                            <i
                              className="manicon manicon-x"
                              aria-hidden="true"
                            />
                          </button>
                        </HigherOrder.Authorize>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <HigherOrder.Authorize entity="page" ability="create">
          <div className="buttons-icon-horizontal">
            <Link
              className="button-icon-secondary"
              to={lh.link("backendContentPageNew")}
            >
              <i className="manicon manicon-plus" />
              Add a New Page
            </Link>
          </div>
        </HigherOrder.Authorize>
      </div>
    );
  }
}

export default connectAndFetch(PagesDashboardContainer);
