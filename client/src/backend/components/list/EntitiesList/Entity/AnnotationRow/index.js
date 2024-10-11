import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import FormattedDate from "global/components/FormattedDate";
import Collapse from "global/components/Collapse";
import LabelSet from "../LabelSet";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

function AnnotationRow({ entity, onDelete }) {
  const { id, attributes } = entity;
  const {
    subject,
    format,
    private: isPrivate,
    flagsCount,
    createdAt,
    textTitle,
    creatorName
  } = attributes;
  const { t } = useTranslation();

  return (
    <Collapse>
      <Styled.Item className="entity-row entity-list__entity scheme-dark">
        <Styled.Toggle>
          <Styled.Content stubHeight={120}>
            <Styled.Inner className="entity-row__inner entity-row__inner--in-rows">
              <div className="entity-row__text entity-row__text--in-rows">
                <Styled.MetaOne>
                  <FormattedDate format="MMMM dd, yyyy" date={createdAt} />
                  <LabelSet
                    labels={[
                      format,
                      ...(!isPrivate
                        ? [
                            {
                              text: isPrivate ? "private" : "public",
                              level: "notice"
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
                  <span>{creatorName}</span>
                  <span dangerouslySetInnerHTML={{ __html: textTitle }} />
                </Styled.MetaTwo>
                <Styled.Subject className="entity-row__title entity-row__title">
                  {subject}
                </Styled.Subject>
              </div>
              <Styled.Utility>
                <button
                  className="entity-row__utility-button"
                  title={t("records.annotations.remove_label")}
                  onClick={() => onDelete(id)}
                >
                  <Utility.IconComposer icon="delete24" size={26} />
                </button>
              </Styled.Utility>
            </Styled.Inner>
            <Styled.Overlay />
          </Styled.Content>
        </Styled.Toggle>
      </Styled.Item>
    </Collapse>
  );
}

AnnotationRow.propTypes = {
  entity: PropTypes.object,
  active: PropTypes.string
};

export default AnnotationRow;
