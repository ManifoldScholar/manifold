import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import EntityGroup from "global/components/entity/Group";
import * as Styled from "./styles";

function JournalVolumeList({ volumes, journal }) {
  const { t } = useTranslation();

  if (!volumes || !journal) return null;

  return (
    <Styled.Wrapper>
      {volumes.map(volume => (
        <EntityGroup
          key={volume.id}
          title={`${t("glossary.volume_title_case_one")} ${
            volume.attributes.number
          }`}
          to={`/journals/${journal.attributes.slug}/volumes/${volume.attributes.slug}`}
          entities={volume.relationships.journalIssues}
          parentView
          placeholderText={t("placeholders.volume_no_issues")}
        />
      ))}
    </Styled.Wrapper>
  );
}

JournalVolumeList.displayName = "Journal.VolumeList";

JournalVolumeList.propTypes = {
  journal: PropTypes.object,
  volumes: PropTypes.array
};

export default JournalVolumeList;
