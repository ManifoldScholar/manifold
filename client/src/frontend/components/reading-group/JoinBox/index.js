import { useState, useEffect, useCallback, useId, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useRevalidator } from "react-router";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import { useCurrentUser, useConfirmation } from "hooks";
import { readingGroupsAPI, readingGroupMembershipsAPI } from "api";
import template from "lodash/template";
import Dialog from "global/components/dialog";
import ActionBox from "frontend/components/reading-group/ActionBox";
import queryString from "query-string";
import has from "lodash/has";
import * as Styled from "./styles";

function JoinBox({ readingGroup }) {
  const { t } = useTranslation();
  const location = useLocation();
  const currentUser = useCurrentUser();
  const { revalidate } = useRevalidator();
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
    async readingGroupData => {
      try {
        await queryApi(
          readingGroupMembershipsAPI.create({
            userId: currentUser.id,
            readingGroupId: readingGroupData.id
          })
        );
        setCode("");
        revalidate();
      } catch (error) {
        handleFailure();
      }
    },
    [currentUser, revalidate, handleFailure]
  );

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
          doJoin(readingGroupData).then(() => {
            closeDialog();
          });
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
