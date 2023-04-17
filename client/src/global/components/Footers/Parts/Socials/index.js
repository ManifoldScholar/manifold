import React from "react";
import * as Styled from "../Navigation/styles";

export default function FooterPartsSocials({ links }) {
  return (
    <Styled.Nav aria-label="Site & Social Links">
      <Styled.List>
        <li>
          <Styled.Group>
            {links.map(link => (
              <Styled.Item key={`${link.to}${link.title}`}>
                <Styled.Link item={link} />
              </Styled.Item>
            ))}
          </Styled.Group>
        </li>
      </Styled.List>
    </Styled.Nav>
  );
}
