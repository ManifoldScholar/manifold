import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Tile from "./Tile";
import lh from "helpers/linkHandler";
import Loadable from "react-loadable";

/* eslint-disable react/prop-types */
const autolinkTweet = props => {
  const Loaded = Loadable({
    loader: () => import(/* webpackChunkName: "autolinker" */ "autolinker"),
    render(Autolinker) {
      const excerpt = Autolinker.link(props.excerpt, props.options);
      return <p dangerouslySetInnerHTML={{ __html: excerpt }} />;
    },
    loading: () => <p dangerouslySetInnerHTML={{ __html: props.excerpt }} />
  });

  return <Loaded {...props} />;
};
/* eslint-enable react/prop-types */

export default class Event extends PureComponent {
  static displayName = "Event.Event";

  static propTypes = {
    event: PropTypes.object,
    itemClass: PropTypes.string,
    destroyCallback: PropTypes.func,
    hideLink: PropTypes.bool
  };

  eventProps() {
    const attributes = this.props.event.attributes;
    const type = attributes.eventType;

    switch (type) {
      case "annotation_created":
        return this.propsForAnnotationCreated(attributes);
      case "tweet":
        return this.propsForTweet(attributes);
      case "resource_added":
        return this.propsForResourceAdded(attributes);
      case "text_added":
        return this.propsForTextAdded(attributes);
      case "project_created":
        return this.propsForProjectCreated(attributes);
      case "collection_added":
        return this.propsForCollectionAdded(attributes);
      default:
        return { visible: false };
    }
  }

  propsForAnnotationCreated(attr) {
    return {
      type: attr.eventType,
      postAttribution: attr.attribution,
      icon: "activity-text"
    };
  }

  propsForTweet(attr) {
    const contentProps = {
      excerpt: attr.excerpt,
      options: { hashtag: "twitter", mention: "twitter" }
    };

    return {
      tileClass: "tweet",
      icon: "activity-tweet",
      type: attr.eventType,
      preAttribution: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://twitter.com/${attr.attributionIdentifier}`}
        >
          {"@" + attr.attributionIdentifier}
        </a>
      ),
      content: autolinkTweet(contentProps),
      date: attr.createdAt,
      dateFormat: "MMMM Do, YYYY",
      linkHref: attr.eventUrl,
      linkTarget: "_blank"
    };
  }

  propsForProjectCreated(attr) {
    return {
      type: attr.eventType,
      icon: "activity-egg",
      date: attr.createdAt,
      header: attr.eventTitle,
      dateFormat: "MMMM Do, YYYY",
      title: attr.eventSubtitle
    };
  }

  propsForTextAdded(attr) {
    return {
      type: attr.eventType,
      date: attr.createdAt,
      header: "Text Added",
      dateFormat: "MMMM Do, YYYY",
      title: attr.subjectTitle,
      icon: "activity-text",
      linkHref: lh.link("reader", attr.subjectSlug)
    };
  }

  propsForResourceAdded(attr) {
    return {
      type: attr.eventType,
      date: attr.createdAt,
      header: "Resource Added",
      dateFormat: "MMMM Do, YYYY",
      title: attr.subjectTitle,
      icon: "activity-resource",
      linkHref: lh.link(
        "frontendProjectResource",
        attr.projectSlug,
        attr.subjectSlug
      )
    };
  }

  propsForCollectionAdded(attr) {
    return {
      type: attr.eventType,
      date: attr.createdAt,
      header: "Collection Added",
      dateFormat: "MMMM Do, YYYY",
      title: attr.subjectTitle,
      icon: "activity-resource",
      linkHref: lh.link(
        "frontendProjectCollection",
        attr.projectSlug,
        attr.subjectSlug
      )
    };
  }

  render() {
    const tileProps = this.eventProps();
    return (
      <Tile
        hideLink={this.props.hideLink}
        destroyCallback={this.props.destroyCallback}
        itemClass={this.props.itemClass}
        {...tileProps}
      />
    );
  }
}
