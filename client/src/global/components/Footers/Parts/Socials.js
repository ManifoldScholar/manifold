import React from "react";
import NavigationLink from "./NavigationLink";

export default function FooterPartsSocials({ links }) {
  return (
    <div className="app-footer__socials">
      <ul className="app-footer__socials-list">
        {links.map(link => (
          <li key={link.icon} className="app-footer__socials-item">
            <NavigationLink hideLabel item={link} />
          </li>
        ))}
      </ul>
    </div>
  );
}
