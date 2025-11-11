import { useState, useEffect, useCallback } from "react";
import { UIDConsumer } from "react-uid";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom-v5-compat";
import { useCurrentUser } from "hooks";
import withConfirmation from "hoc/withConfirmation";
import { readingGroupsAPI, readingGroupMembershipsAPI, requests } from "api";
import template from "lodash/template";
import { entityStoreActions } from "actions";
import ActionBox from "frontend/components/reading-group/ActionBox";
import queryString from "query-string";
import has from "lodash/has";
import * as Styled from "./styles";

const { request } = entityStoreActions;

function JoinBox({ readingGroup, onJoin, confirm }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();
  const currentUser = useCurrentUser();
  const [code, setCode] = useState("");

  const messages = t("messages.reading_group.join", {
    name: readingGroup,
    returnObjects: true
  });

  const handleFailure = useCallback(() => {
    const heading = messages.join_failure_heading;
    const message = messages.join_failure_message;
    confirm(heading, message);
  }, [messages, confirm]);

  const doJoin = useCallback(
    readingGroupData => {
      const fetch = request(
        readingGroupMembershipsAPI.create({
          userId: currentUser.id,
          readingGroupId: readingGroupData.id
        }),
        requests.feReadingGroupMembershipCreate,
        { suppressErrors: true }
      );
      const result = dispatch(fetch);
      result.promise.then(theResult => {
        setCode("");
        onJoin(theResult);
      }, handleFailure);
    },
    [currentUser, dispatch, onJoin, handleFailure]
  );

  const openConfirmation = useCallback(
    readingGroupData => {
      const heading = messages.heading;
      const message = messages.message;
      const compiledMessage = template(message)({
        readingGroup: readingGroupData
      });
      const callback = () => {
        doJoin(readingGroupData);
      };
      confirm(heading, compiledMessage, callback);
    },
    [messages, confirm, doJoin]
  );

  const openNotFound = useCallback(() => {
    const heading = messages.join_not_found_heading;
    const message = messages.join_not_found_message;
    confirm(heading, message, null, {
      rejectLabel: t("common.okay")
    });
  }, [messages, confirm, t]);

  useEffect(() => {
    const query = queryString.parse(location.search);
    if (has(query, "join")) {
      const joinCode = query.join;
      setCode(joinCode);
      // Fetch group immediately with the code from query
      const fetch = request(
        readingGroupsAPI.show(joinCode),
        requests.feReadingGroupsLookup,
        { suppressErrors: true }
      );
      const result = dispatch(fetch);
      result.promise.then(
        response => {
          setTimeout(() => {
            openConfirmation(response.data);
          }, 0);
        },
        () => {
          openNotFound();
        }
      );
    }
  }, [location.search, dispatch, openConfirmation, openNotFound]);

  const updateCode = event => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
    }
    const newCode = event.target.value;
    setCode(newCode);
  };

  const fetchGroup = () => {
    const fetch = request(
      readingGroupsAPI.show(code),
      requests.feReadingGroupsLookup,
      { suppressErrors: true }
    );
    const result = dispatch(fetch);
    return result.promise;
  };

  const handleSubmit = (event = null) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
    }
    fetchGroup().then(
      response => {
        setTimeout(() => {
          openConfirmation(response.data);
        }, 0);
      },
      () => {
        openNotFound();
      }
    );
  };

  return (
    <ActionBox
      title={t("forms.join_group.title")}
      instructions={t("forms.join_group.instructions")}
      actions={
        <Styled.Form onSubmit={handleSubmit}>
          <UIDConsumer name={id => `join-box-${id}`}>
            {id => (
              <Styled.Label htmlFor={id}>
                <span className="screen-reader-text">
                  {t("forms.join_group.join_code")}
                </span>
                <Styled.Input
                  id={id}
                  value={code}
                  onChange={updateCode}
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

export default withConfirmation(JoinBox);
