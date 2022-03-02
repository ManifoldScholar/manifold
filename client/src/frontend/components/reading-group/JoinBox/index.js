import React, { PureComponent } from "react";
import { UIDConsumer } from "react-uid";
import withDispatch from "hoc/withDispatch";
import withConfirmation from "hoc/withConfirmation";
import withCurrentUser from "hoc/withCurrentUser";
import { withTranslation } from "react-i18next";
import config from "config";
import { readingGroupsAPI, readingGroupMembershipsAPI, requests } from "api";
import { withRouter } from "react-router-dom";
import template from "lodash/template";
import { entityStoreActions } from "actions";
import ActionBox from "frontend/components/reading-group/ActionBox";

const { request } = entityStoreActions;
import queryString from "query-string";
import has from "lodash/has";

class JoinBox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { code: "" };
  }

  componentDidMount() {
    const query = queryString.parse(this.props.location.search);
    if (has(query, "join")) {
      this.setState({ code: query.join }, () => {
        this.handleSubmit();
      });
    }
  }

  updateCode = event => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
    }
    const code = event.target.value;
    this.setState({ code });
  };

  handleSubmit = (event = null) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
    }
    this.fetchGroup().then(
      response => {
        setTimeout(() => {
          this.openConfirmation(response.data);
        }, 0);
      },
      () => {
        this.openNotFound();
      }
    );
  };

  handleFailure = () => {
    const {
      heading,
      message
    } = config.app.locale.dialogs.readingGroup.joinFailure;
    this.props.confirm(heading, message);
  };

  openConfirmation(readingGroup) {
    const { heading, message } = config.app.locale.dialogs.readingGroup.join;
    const compiledMessage = template(message)({ readingGroup });
    const callback = () => {
      this.doJoin(readingGroup);
    };
    this.props.confirm(heading, compiledMessage, callback);
  }

  doJoin = readingGroup => {
    const fetch = request(
      readingGroupMembershipsAPI.create({
        userId: this.props.currentUser.id,
        readingGroupId: readingGroup.id
      }),
      requests.feReadingGroupMembershipCreate,
      { suppressErrors: true }
    );
    const result = this.props.dispatch(fetch);
    result.promise.then(theResult => {
      this.setState({ code: "" });
      this.props.onJoin(theResult);
    }, this.handleFailure);
  };

  openNotFound() {
    const {
      heading,
      message
    } = config.app.locale.dialogs.readingGroup.joinNotFound;
    this.props.confirm(heading, message, null, {
      rejectLabel: this.props.t("forms.join_group.confirm_button_label")
    });
  }

  fetchGroup() {
    const fetch = request(
      readingGroupsAPI.show(this.state.code),
      requests.feReadingGroupsLookup,
      { suppressErrors: true }
    );
    const result = this.props.dispatch(fetch);
    return result.promise;
  }

  render() {
    const t = this.props.t;

    return (
      <ActionBox
        title={t("forms.join_group.title")}
        instructions={t("forms.join_group.instructions")}
        actions={
          <form onSubmit={this.handleSubmit} className="group-join-form">
            <UIDConsumer name={id => `join-box-${id}`}>
              {id => (
                <label htmlFor={id} className="group-join-form__label">
                  <span className="screen-reader-text">
                    {t("forms.join_group.join_code")}
                  </span>
                  <input
                    id={id}
                    value={this.state.code}
                    onChange={this.updateCode}
                    placeholder={t("forms.join_group.code_placeholder")}
                    className="group-join-form__input"
                    required
                  />
                </label>
              )}
            </UIDConsumer>
            <button type="submit" className="group-join-form__button">
              {t("forms.join_group.button_label")}
            </button>
          </form>
        }
      />
    );
  }
}

export default withDispatch(
  withCurrentUser(withConfirmation(withRouter(withTranslation()(JoinBox))))
);
