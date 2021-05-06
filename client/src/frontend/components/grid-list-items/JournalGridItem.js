import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import GlobalProject from "global/components/project";
import FormattedDate from "global/components/FormattedDate";
import classNames from "classnames";
import lh from "helpers/linkHandler";
import Collecting from "frontend/components/collecting";

export default class JournalGridItem extends Component {
  static displayName = "Journal.GridItem";

  static propTypes = {
    journal: PropTypes.object,
    hideMeta: PropTypes.bool,
    hideDate: PropTypes.bool,
    hideDesc: PropTypes.bool,
    hideCollectingToggle: PropTypes.bool
  };

  static defaultProps = {
    hideCollectingToggle: false
  };

  get hideCollectingToggle() {
    return this.props.hideCollectingToggle;
  }

  shouldShowUpdated(journal) {
    const { updated, finished } = journal.attributes;
    return !finished && Boolean(updated);
  }

  renderPublishedDate(journal) {
    const attr = journal.attributes;
    if (attr.publicationDate && !this.props.hideDate) {
      return (
        <div className="date" aria-hidden>
          <FormattedDate
            prefix="Published"
            format="MMMM, yyyy"
            date={attr.publicationDate}
          />
        </div>
      );
    }
    return null;
  }

  renderJournalDesc(journal) {
    if (this.props.hideDesc || !journal.attributes.subtitle) return null;
    return (
      <p className="description" aria-hidden>
        {journal.attributes.subtitle}
      </p>
    );
  }

  renderJournalStatusMarker(journal) {
    // Currently, this can only return a 'draft' marker
    let marker = null;

    if (journal.attributes.draft) {
      marker = (
        <div className="block-label" aria-hidden>
          {"Draft"}
        </div>
      );
    }

    return marker;
  }

  renderVolumeJournal(journal) {
    return (
      <div className="relations-list" aria-hidden>
        <span>
          Volume {journal.volume}, Issue {journal.issue}
        </span>
      </div>
    );
  }

  renderUpdatedDate(journal) {
    if (journal.attributes.draft) return null;
    const classes = classNames({
      date: true,
      alert: journal.attributes.recentlyUpdated
    });
    return (
      <div className={classes} aria-hidden>
        <FormattedDate
          prefix="Updated"
          format="MMMM, yyyy"
          date={journal.attributes.updatedAt}
        />
      </div>
    );
  }

  render() {
    const journal = this.props.journal;
    let journalMeta = null;
    if (!this.props.hideMeta) {
      journalMeta = (
        <div className="meta">
          <h3 className="name">
            <span
              className="title-text"
              dangerouslySetInnerHTML={{
                __html: journal.attributes.titleFormatted
              }}
            />
            {this.renderJournalStatusMarker(journal)}
          </h3>
          {this.renderVolumeJournal(journal)}
          {this.shouldShowUpdated(journal)
            ? this.renderUpdatedDate(journal)
            : this.renderPublishedDate(journal)}
          {this.renderJournalDesc(journal)}
        </div>
      );
    }

    const figureClass = classNames("cover", {
      "cover-placeholder": journal.attributes.avatarStyles.small,
      dim: journal.attributes.draft
    });

    return (
      <>
        <Link to={lh.link("frontendJournalDetail", journal.attributes.slug)}>
          <figure className={figureClass}>
            <GlobalProject.Avatar project={journal} />
          </figure>
          {journalMeta}
        </Link>
        {!this.hideCollectingToggle && (
          <Collecting.Toggle
            collectable={journal}
            inline={false}
            outlined={false}
          />
        )}
      </>
    );
  }
}
