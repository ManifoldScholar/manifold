import { useState, useEffect, useCallback, useId } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useFetcher } from "react-router";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import { useAuthentication, useConfirmation } from "hooks";
import { readingGroupsAPI } from "api";
import template from "lodash/template";
import Dialog from "components/global/dialog";
import ActionBox from "components/frontend/reading-group/ActionBox";
import queryString from "query-string";
import has from "lodash/has";
import * as Styled from "./styles";

function JoinBox({ readingGroup }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { currentUser } = useAuthentication();
  const fetcher = useFetcher();
  const { confirm, confirmation } = useConfirmation();
  const [code, setCode] = useState("");
  const id = useId();

  const messages = t("messages.reading_group.join", {
    name: readingGroup,
    returnObjects: true
  });

  const handleFailure = useCallback(() => {
    const heading = messages.join_failure_heading;
    const message = messages.join_failure_message;
    confirm({
      heading,
      message
    });
  }, [messages, confirm]);

  const doJoin = useCallback(
    readingGroupData => {
      fetcher.submit(
        JSON.stringify({
          intent: "join",
          userId: currentUser.id,
          readingGroupId: readingGroupData.id
        }),
        {
          method: "post",
          encType: "application/json",
          action: "/actions/reading-group-membership"
        }
      );
    },
    [currentUser, fetcher]
  );

  useEffect(() => {
    if (fetcher.data?.success) {
      setCode("");
    }
    if (fetcher.data?.errors) {
      handleFailure();
    }
  }, [fetcher.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const openConfirmation = useCallback(
    readingGroupData => {
      const heading = messages.heading;
      const message = messages.message;
      const compiledMessage = template(message)({
        readingGroup: readingGroupData
      });
      confirm({
        heading,
        message: compiledMessage,
        callback: closeDialog => {
          doJoin(readingGroupData);
          closeDialog();
        }
      });
    },
    [messages, confirm, doJoin]
  );

  const openNotFound = useCallback(() => {
    const heading = messages.join_not_found_heading;
    const message = messages.join_not_found_message;
    confirm({
      heading,
      message,
      rejectLabel: t("common.okay")
    });
  }, [messages, confirm, t]);

  useEffect(() => {
    const query = queryString.parse(location.search);
    if (has(query, "join")) {
      const joinCode = query.join;
      setCode(joinCode);
      // Fetch group immediately with the code from query
      queryApi(readingGroupsAPI.show(joinCode))
        .then(response => {
          setTimeout(() => {
            openConfirmation(response?.data ?? response);
          }, 0);
        })
        .catch(() => {
          openNotFound();
        });
    }
  }, [location.search, openConfirmation, openNotFound]);

  const updateCode = event => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
    }
    const newCode = event.target.value;
    setCode(newCode);
  };

  const handleSubmit = (event = null) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
    }
    queryApi(readingGroupsAPI.show(code))
      .then(response => {
        setTimeout(() => {
          openConfirmation(response?.data ?? response);
        }, 0);
      })
      .catch(() => {
        openNotFound();
      });
  };

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <ActionBox
        title={t("forms.join_group.title")}
        instructions={t("forms.join_group.instructions")}
        actions={
          <Styled.Form onSubmit={handleSubmit}>
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
            <Styled.Button type="submit">
              {t("forms.join_group.button_label")}
            </Styled.Button>
          </Styled.Form>
        }
      />
    </>
  );
}

export default JoinBox;
