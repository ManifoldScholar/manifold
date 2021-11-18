import React from "react";
import chunk from "lodash/chunk";
import has from "lodash/has";
import * as Styled from "./styles";

export default function FooterPartNavigation({ children }) {
  const withIcons = children.filter(child => has(child, "icon"));
  const withoutIcons = children.filter(child => !has(child, "icon"));
  const groupedLinks = chunk(withoutIcons, 4);

  /* eslint-disable react/no-array-index-key */
  return (
    <div>
      <Styled.Nav $mobile aria-hidden>
        <Styled.List>
          <li>
            <Styled.Group>
              {withoutIcons.map(link => (
                <Styled.Item key={`${link.to}${link.title}`}>
                  <Styled.Link item={link} />
                </Styled.Item>
              ))}
            </Styled.Group>
          </li>
          <li>
            <Styled.Group>
              {withIcons.map(link => (
                <Styled.Item key={`${link.to}${link.title}`}>
                  <Styled.Link item={link} />
                </Styled.Item>
              ))}
            </Styled.Group>
          </li>
        </Styled.List>
      </Styled.Nav>
      <Styled.Nav aria-label="Site & Social Links">
        <Styled.List>
          {groupedLinks.map((linkGroup, linkGroupIndex) => (
            <li key={linkGroupIndex}>
              {linkGroup.length > 0 && (
                <Styled.Group>
                  {linkGroup.map(link => (
                    <Styled.Item key={`${link.to}${link.title}`}>
                      <Styled.Link item={link} />
                    </Styled.Item>
                  ))}
                </Styled.Group>
              )}
            </li>
          ))}
          <li>
            <Styled.Group>
              {withIcons.map(link => (
                <Styled.Item key={`${link.to}${link.title}`}>
                  <Styled.Link item={link} />
                </Styled.Item>
              ))}
            </Styled.Group>
          </li>
        </Styled.List>
      </Styled.Nav>
    </div>
  );
  /* eslint-enable react/no-array-index-key */
}
