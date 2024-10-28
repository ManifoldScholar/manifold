import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import FormattedDate from "global/components/FormattedDate";
import Collapse from "global/components/Collapse";
import LabelSet from "../LabelSet";
import lh from "helpers/linkHandler";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

function AnnotationRow({ entity, onDelete, hideCreator }) {
  const { id, attributes } = entity;
  const {
    body,
    private: isPrivate,
    flagsCount,
    createdAt,
    textTitle,
    creatorName,
    creatorId,
    orphaned,
    textSlug,
    textSectionId
  } = attributes;
  const { t } = useTranslation();

  return (
    <Collapse>
      <Styled.Item className="entity-row entity-list__entity scheme-dark">
        <Styled.Inner className="entity-row__inner entity-row__inner--in-rows">
          <Styled.Text className="entity-row__text entity-row__text--in-rows">
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
                <a href={lh.link("backendRecordsUserProperties", creatorId)}>
                  {creatorName}
                </a>
              )}
              <a
                href={lh.link(
                  "readerSection",
                  textSlug,
                  textSectionId,
                  `#annotation-${id}`
                )}
                dangerouslySetInnerHTML={{
                  __html: textTitle ?? "[Text Title Missing]"
                }}
              />
            </Styled.MetaTwo>
            <Styled.Toggle>
              <Styled.Content stubHeight={60}>
                {body && (
                  <Styled.Body className="entity-row__title entity-row__title">
                    {body}
                  </Styled.Body>
                )}
                <Styled.Overlay />
              </Styled.Content>
            </Styled.Toggle>
          </Styled.Text>
        </Styled.Inner>
        <Styled.Utility>
          <a
            className="entity-row__utility-button"
            title={t("records.annotations.remove_label")}
            href={lh.link("backendRecordsAnnotationsDetail", id)}
          >
            <Utility.IconComposer icon="annotate24" size={26} />
          </a>
          <button
            className="entity-row__utility-button"
            title={t("records.annotations.remove_label")}
            onClick={() => onDelete(id)}
          >
            <Utility.IconComposer icon="delete24" size={26} />
          </button>
        </Styled.Utility>
      </Styled.Item>
    </Collapse>
  );
}

AnnotationRow.propTypes = {
  entity: PropTypes.object,
  active: PropTypes.string
};

export default AnnotationRow;
