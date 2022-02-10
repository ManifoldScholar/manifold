import React from "react";
import lh from "helpers/linkHandler";
import { FooterLink } from "frontend/components/composed/EntityCollection/parts";
import * as Styled from "./styles";

function VolumesForJournalLink({ journal }) {
  return (
    <Styled.LinkWrapper>
      <FooterLink
        to={lh.link("frontendJournalAllVolumes", journal.id)}
        label="See all volumes"
      />
    </Styled.LinkWrapper>
  );
}

export default VolumesForJournalLink;
