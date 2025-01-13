import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import FormattedDate from "global/components/FormattedDate";
import LabelSet from "../LabelSet";
import Checkbox from "../../List/bulkActions/Checkbox";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

function AnnotationRow({
  entity,
  hideCreator,
  bulkActionsActive,
  bulkSelection,
  addItem,
  removeItem,
  onDelete
}) {
  const { id, attributes } = entity;
  const {
    body,
    private: notePrivate,
    readingGroupPrivacy,
    unresolvedFlagsCount,
    createdAt,
    textTitle,
    creatorName,
    creatorId,
    orphaned
  } = attributes;

  const { t } = useTranslation();

  const isPrivate = notePrivate || readingGroupPrivacy === "private";

  const isSelected =
    !!bulkSelection?.filters || bulkSelection?.ids?.includes(id);

  const utility = !bulkActionsActive ? (
    <button
      className="entity-row__utility-button"
      title={t("actions.delete")}
      onClick={() => onDelete(id)}
    >
      <Utility.IconComposer icon="delete32" size={26} />
    </button>
  ) : (
    undefined
  );

  return (
    <Styled.Item className="entity-row entity-list__entity scheme-dark">
      {bulkActionsActive && (
        <Checkbox
          checked={isSelected}
          onSelect={() => addItem(id)}
          onClear={() => removeItem(id)}
        />
      )}
      <Styled.Inner className="entity-row__inner entity-row__inner--in-rows">
        <div className="entity-row__text entity-row__text--in-rows">
          <Styled.MetaOne>
            <FormattedDate format="MMMM dd, yyyy" date={createdAt} />
            <LabelSet
              labels={[
                ...(!isPrivate
                  ? [
                      {
                        text: isPrivate
                          ? t("common.private")
                          : t("common.public"),
                        level: "notice"
                      }
                    ]
                  : []),
                ...(orphaned
                  ? [
                      {
                        text: t("record.annotations.orphaned_tag"),
                        level: ""
                      }
                    ]
                  : []),
                ...(unresolvedFlagsCount
                  ? [
                      {
                        text: t("records.annotations.flag_count", {
                          count: unresolvedFlagsCount
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
                __html:
                  textTitle ?? t("records.annotations.text_title_placeholder")
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
        <div className="entity-row__utility">{utility}</div>
      </Styled.Inner>
    </Styled.Item>
  );
}

AnnotationRow.propTypes = {
  entity: PropTypes.object,
  hideCreator: PropTypes.bool,
  bulkActionsActive: PropTypes.bool,
  bulkSelection: PropTypes.object,
  addItem: PropTypes.func,
  removeItem: PropTypes.func,
  onDelete: PropTypes.func
};

export default AnnotationRow;
