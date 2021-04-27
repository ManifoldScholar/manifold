import React from "react";
import ResponsiveImage from "../../../global/components/ResponsiveImage";
import Social from "../project/Hero/Social";
import Collecting from "frontend/components/collecting";

const JournalDetail = ({
  journal,
  blockClass = "journal-detail",
  ...props
}) => {
  const hasBackgroundImage = () => {
    return true;
  };
  const getSrcSet = () => {
    const attrs = journal.attributes;
    return {
      renditions: [
        {
          width: attrs.avatarMeta.mediumLandscape,
          distributionUrl: attrs.heroStyles.mediumLandscape
        },
        {
          width: attrs.avatarMeta.largeLandscape,
          distributionUrl: attrs.heroStyles.largeLandscape
        }
      ]
    };
  };
  return (
    <div className={blockClass}>
      <div className={`${blockClass}__banner`}>
        {hasBackgroundImage() && (
          <ResponsiveImage {...props} image={getSrcSet()} />
        )}
      </div>
      <div className={`${blockClass}__body`}>
        <div className={`${blockClass}__body--left`}>
          <div className={`${blockClass}__body--left__title`}>
            <div>{journal.attributes.title}</div>
            <div>
              <Collecting.Toggle collectable={journal} />
            </div>
          </div>
          <div
            className={`${blockClass}__body__description`}
            dangerouslySetInnerHTML={{
              __html: journal.attributes.descriptionFormatted
            }}
          />
          <div className={`${blockClass}__social`}>
            <Social
              wrapperClassName={`${blockClass}__left-bottom-block`}
              blockClass={blockClass}
              project={journal}
            />
          </div>
        </div>
        <div className="journal-detail__body--right">Right</div>
      </div>
    </div>
  );
};

export default JournalDetail;
