import React from "react";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

function CollectionPlaceholder() {
  return (
    <section className="collection-placeholder">
      <div className="collection-placeholder__inner">
        <h3 className="collection-placeholder__heading">
          Ready to customize your group?
        </h3>
        <p>
          Congratulations, you’ve created a Reading Group. Now you can begin
          adding content, editing the order, grouping, and descriptions on your
          home page, and sending out invitations for new members.
        </p>
        <h3 className="collection-placeholder__heading">
          Start adding content:
        </h3>
        <p>
          Reading Groups can contain a variety of content: Projects, Texts, Text
          Sections, Resource Collections, and individual Resources can all be
          added to your group. To find and add content, you can either browse
          the library or use keyword search. Once you’ve found an item you wish
          to add, simply select the star icon and assign it to this group (or
          any other Reading Group you are managing).
        </p>
        <div className="collection-placeholder__actions">
          <Link to={lh.link("frontendProjects")} className="button-tertiary">
            Browse library
          </Link>
          <a href="#search" className="button-tertiary">
            Search by keyword
          </a>
        </div>
        <h3 className="collection-placeholder__heading">
          Edit settings and invite members:
        </h3>
        <p>
          You can edit the settings for your group at any time. Change your
          group’s name, privacy settings, or email notifications. You can also
          see your group’s invitation code, or use an invitation URL, which
          makes inviting members as easy as sharing its invitation web page
          address.
        </p>
        <div className="collection-placeholder__actions">
          <a href="#settings" className="button-tertiary">
            Edit group info
          </a>
        </div>
      </div>
    </section>
  );
}

CollectionPlaceholder.displayName = "Collecting.CollectionPlaceholder";

export default CollectionPlaceholder;
