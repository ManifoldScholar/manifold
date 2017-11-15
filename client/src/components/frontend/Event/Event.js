import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Tile from "./Tile";
import lh from "helpers/linkHandler";

export default class Event extends PureComponent {
  static displayName = "Event.Event";

  static propTypes = {
    event: PropTypes.object,
    itemClass: PropTypes.string,
    destroyCallback: PropTypes.func,
    hideLink: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    import(/* webpackChunkName: "autolinker" */ "autolinker").then(
      autolinker => {
        this.setState({ autolinker });
      }
    );
  }

  autoLink(excerpt) {
    if (!this.state.autolinker) return { __html: excerpt };
    const options = {
      mention: "twitter",
      hashtag: "twitter"
    };
    return {
      __html: this.state.autolinker.link(excerpt, options)
    };
  }

  eventProps() {
    const type = this.props.event.attributes.eventType;
    if (type === "ANNOTATION_CREATED") return this.propsForAnnotationCreated();
    if (type === "TWEET") return this.propsForTweet();
    if (type === "RESOURCE_ADDED") return this.propsForResourceAdded();
    if (type === "TEXT_ADDED") return this.propsForTextAdded();
    if (type === "PROJECT_CREATED") return this.propsForProjectCreated();
    return { visible: false };
  }

  propsForAnnotationCreated() {
    const attr = this.props.event.attributes;
    return {
      type: attr.eventType,
      postAttribution: attr.attribution,
      iconClass: "manicon manicon-person-word-bubble"
    };
  }

  propsForTweet() {
    const attr = this.props.event.attributes;
    return {
      tileClass: "tweet",
      iconClass: "manicon manicon-twitter",
      type: attr.eventType,
      preAttribution: (
        <a
          target="_blank"
          href={`https://twitter.com/${attr.attributionIdentifier}`}
        >
          {"@" + attr.attributionIdentifier}
        </a>
      ),
      content: <p dangerouslySetInnerHTML={this.autoLink(attr.excerpt)} />,
      date: attr.createdAt,
      dateFormat: "MMMM Do, YYYY",
      linkPrompt: "View Tweet",
      linkHref: attr.eventUrl,
      linkTarget: "_blank"
    };
  }

  propsForProjectCreated() {
    const attr = this.props.event.attributes;
    return {
      type: attr.eventType,
      iconClass: "manicon manicon-egg",
      date: attr.createdAt,
      datePrefix: "Started",
      dateFormat: "MMMM Do, YYYY",
      title: attr.eventTitle,
      subtitle: attr.eventSubtitle
    };
  }

  propsForTextAdded() {
    const attr = this.props.event.attributes;
    return {
      type: attr.eventType,
      date: attr.createdAt,
      datePrefix: "Text Added",
      dateFormat: "MMMM Do, YYYY",
      title: attr.subjectTitle,
      iconClass: "manicon manicon-book-opening",
      linkPrompt: "Start Reading",
      linkHref: lh.link("reader", attr.subjectSlug)
    };
  }

  propsForResourceAdded() {
    const attr = this.props.event.attributes;
    return {
      type: attr.eventType,
      date: attr.createdAt,
      datePrefix: "Resource Added",
      dateFormat: "MMMM Do, YYYY",
      title: attr.subjectTitle,
      iconClass: "manicon manicon-cube-shine",
      linkPrompt: "View Resource",
      linkHref: lh.link(
        "frontendProjectResource",
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
