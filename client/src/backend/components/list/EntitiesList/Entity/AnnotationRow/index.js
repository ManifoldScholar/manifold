import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import FormattedDate from "global/components/FormattedDate";
import LabelSet from "../LabelSet";
import lh from "helpers/linkHandler";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

function AnnotationRow({ entity, hideCreator }) {
  const { id, attributes } = entity;
  const {
    body,
    private: notePrivate,
    readingGroupPrivacy,
    flagsCount,
    createdAt,
    textTitle,
    creatorName,
    creatorId,
    orphaned
  } = attributes;
  const { t } = useTranslation();

  const isPrivate = notePrivate || readingGroupPrivacy === "private";

  return (
    <Styled.Item className="entity-row entity-list__entity scheme-dark">
      <div className="entity-row__inner entity-row__inner--in-rows">
        <div className="entity-row__text entity-row__text--in-rows">
          <Styled.MetaOne>
            <FormattedDate format="MMMM dd, yyyy" date={createdAt} />
            <LabelSet
              labels={[
                ...(!isPrivate
                  ? [
                      {
                        text: isPrivate ? "private" : "public",
                        level: "notice"
                      }
                    ]
                  : []),
                ...(orphaned
                  ? [
                      {
                        text: "previous",
                        level: ""
                      }
                    ]
                  : []),
                ...(flagsCount
                  ? [
                      {
                        text: t("records.annotations.flag_count", {
                          count: flagsCount
                        }),
                        level: "error"
                      }
                    ]
                  : [])
              ]}
            />
          </Styled.MetaOne>
          <Styled.MetaTwo className="entity-row__subtitle entity-row__subtitle--in-rows">
            {!hideCreator && (
              <Link
                to={{
                  pathname: lh.link("backendRecordsUserProperties", creatorId)
                }}
              >
                {creatorName}
              </Link>
            )}
            <span
              dangerouslySetInnerHTML={{
                __html: textTitle ?? "[Text Title Missing]"
              }}
            />
          </Styled.MetaTwo>
          <Styled.Link
            to={{ pathname: lh.link("backendRecordsAnnotationsDetail", id) }}
          >
            {body && (
              <Styled.Body className="entity-row__title entity-row__title">
                {body}
              </Styled.Body>
            )}
          </Styled.Link>
        </div>
      </div>
    </Styled.Item>
  );
}

AnnotationRow.propTypes = {
  entity: PropTypes.object,
  active: PropTypes.string
};

export default AnnotationRow;
