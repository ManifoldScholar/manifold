import React from "react";
import PropTypes from "prop-types";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityMasthead from "frontend/components/composed/EntityMasthead";
import Journal from "frontend/components/journal";
import { useSelectVolume, useDispatchVolume } from "hooks/journals";

function VolumeDetailContainer({ match, journal, settings }) {
  const { volume, volumeResponse } = useSelectVolume(match, journal);
  useDispatchVolume(match);

  const ogTitle = title => {
    const { socialTitle, title: journalTitle } = journal.attributes;

    if (socialTitle) return `${socialTitle}: ${title}`;

    if (!settings) return null;

    return `\u201c${journalTitle}: ${title}\u201d on ${settings.attributes.general.installationName}`;
  };

  const ogDescription = () => {
    const { descriptionPlaintext, socialDescription } = journal.attributes;
    return socialDescription || descriptionPlaintext;
  };

  const ogImage = () => {
    const { socialImageStyles, heroStyles } = journal.attributes;
    if (socialImageStyles?.mediumLandscape)
      return socialImageStyles.mediumLandscape;
    if (heroStyles?.mediumLandscape) return heroStyles.mediumLandscape;
    return null;
  };

  if (!volumeResponse || !journal) return null;

  const {
    attributes: { title }
  } = volume;

  return (
    <>
      <CheckFrontendMode debugLabel="VolumeDetail" isProjectSubpage />
      <RegisterBreadcrumbs
        breadcrumbs={[
          {
            to: lh.link("frontendJournalsList"),
            label: "Back to All Journals"
          },
          {
            to: lh.link("frontendJournalDetail", journal.id),
            label: journal.attributes.titlePlaintext
          },
          {
            to: lh.link(
              "frontendVolumeDetail",
              journal.id,
              match.params.volumeSlug
            ),
            label: title
          }
        ]}
      />
      <HeadContent
        title={ogTitle(title)}
        description={ogDescription()}
        image={ogImage()}
      />
      <h1 className="screen-reader-text">{`${journal.attributes.title}: ${title}`}</h1>
      <EntityMasthead entity={journal} />
      <Journal.VolumeDetail journal={journal} volume={volume} />
    </>
  );
}

VolumeDetailContainer.displayName = "Frontend.Containers.VolumeDetail";

VolumeDetailContainer.propTypes = {
  match: PropTypes.object.isRequired,
  journal: PropTypes.object,
  settings: PropTypes.object
};

export default VolumeDetailContainer;
