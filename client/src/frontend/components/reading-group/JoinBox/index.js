import React, { PureComponent } from "react";
import { UIDConsumer } from "react-uid";
import withDispatch from "hoc/withDispatch";
import withConfirmation from "hoc/withConfirmation";
import withCurrentUser from "hoc/withCurrentUser";
import { withTranslation } from "react-i18next";
import { readingGroupsAPI, readingGroupMembershipsAPI, requests } from "api";
import { withRouter } from "react-router-dom";
import template from "lodash/template";
import { entityStoreActions } from "actions";
import ActionBox from "frontend/components/reading-group/ActionBox";
import * as Styled from "./styles";

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

  get messages() {
    return this.props.t("messages.reading_group.join", {
      name: this.props.readingGroup,
      returnObjects: true
    });
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
    const heading = this.messages.join_failure_heading;
    const message = this.messages.join_failure_message;
    this.props.confirm(heading, message);
  };

  openConfirmation(readingGroup) {
    const heading = this.messages.heading;
    const message = this.messages.message;
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
    const heading = this.messages.join_not_found_heading;
    const message = this.messages.join_not_found_message;
    this.props.confirm(heading, message, null, {
      rejectLabel: this.props.t("common.okay")
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
          <Styled.Form onSubmit={this.handleSubmit}>
            <UIDConsumer name={id => `join-box-${id}`}>
              {id => (
                <Styled.Label htmlFor={id}>
                  <span className="screen-reader-text">
                    {t("forms.join_group.join_code")}
                  </span>
                  <Styled.Input
                    id={id}
                    value={this.state.code}
                    onChange={this.updateCode}
                    placeholder={t("forms.join_group.code_placeholder")}
                    required
                  />
                </Styled.Label>
              )}
            </UIDConsumer>
            <Styled.Button type="submit">
              {t("forms.join_group.button_label")}
            </Styled.Button>
          </Styled.Form>
        }
      />
    );
  }
}

export default withDispatch(
  withCurrentUser(withConfirmation(withRouter(withTranslation()(JoinBox))))
);
