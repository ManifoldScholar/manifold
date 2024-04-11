import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import FormattedDate from "global/components/FormattedDate";
import Collapse from "global/components/Collapse";
import lh from "helpers/linkHandler";
import LabelSet from "../LabelSet";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

function AnnotationRow({ active, entity, ...props }) {
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

  const additionalProps = {
    title: subject,
    subtitle: creatorName,
    meta: (
      <FormattedDate
        prefix={t("dates.added_title_case")}
        format="MMMM, yyyy"
        date={createdAt}
      />
    ),
    label: isPrivate ? "private" : "public",
    active: active === id,
    onRowClick: lh.link("frontendReadingGroupDetail", id),
    rowClickMode: "inline"
  };

  return (
    <Collapse>
      <Styled.Item className="entity-row entity-list__entity scheme-dark">
        <Styled.Toggle>
          <Styled.Content stubHeight={120}>
            <Styled.Inner className="entity-row__inner entity-row__inner--in-rows">
              <div className="entity-row__text entity-row__text--in-rows">
                <LabelSet
                  labels={[
                    format,
                    ...(!isPrivate
                      ? [
                          {
                            text: isPrivate ? "private" : "public",
                            level: "warning"
                          }
                        ]
                      : []),
                    ...(flagsCount
                      ? [
                          {
                            text: `${flagsCount} flags`,
                            level: "error"
                          }
                        ]
                      : [])
                  ]}
                />
                <Styled.Meta className="entity-row__subtitle entity-row__subtitle--in-rows">
                  <span>{creatorName}</span>
                  <span dangerouslySetInnerHTML={{ __html: textTitle }} />
                </Styled.Meta>
                <Styled.Subject className="entity-row__title entity-row__title">
                  <span className="entity-row__title-inner">{subject}</span>
                </Styled.Subject>
              </div>
              <div className="entity-row__utility">
                <Utility.IconComposer icon="download24" size={26} />
              </div>
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
