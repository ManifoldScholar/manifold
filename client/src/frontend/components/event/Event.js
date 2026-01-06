import { PureComponent } from "react";
import PropTypes from "prop-types";
import Tile from "./Tile/index";

export default class Event extends PureComponent {
  static displayName = "Event.Event";

  static propTypes = {
    event: PropTypes.object,
    itemTag: PropTypes.oneOf(["li", "div"]),
    className: PropTypes.string,
    destroyCallback: PropTypes.func,
    hideLink: PropTypes.bool
  };

  eventProps() {
    const attributes = this.props.event.attributes;
    const type = attributes.eventType;

    switch (type) {
      case "annotation_created":
        return this.propsForAnnotationCreated(attributes);
      case "resource_added":
        return this.propsForResourceAdded(attributes);
      case "text_added":
        return this.propsForTextAdded(attributes);
      case "project_created":
        return this.propsForProjectCreated(attributes);
      case "resource_collection_added":
        return this.propsForCollectionAdded(attributes);
      default:
        return { visible: false };
    }
  }

  propsForAnnotationCreated(attr) {
    return {
      type: attr.eventType,
      postAttribution: attr.attribution,
      icon: "activityComments64"
    };
  }

  propsForProjectCreated(attr) {
    return {
      type: attr.eventType,
      icon: "activityEgg64",
      date: attr.createdAt,
      header: attr.eventTitle,
      dateFormat: "MMMM dd, yyyy",
      title: attr.eventSubtitle
    };
  }

  propsForTextAdded(attr) {
    return {
      type: attr.eventType,
      date: attr.createdAt,
      header: "Text Added",
      dateFormat: "MMMM dd, yyyy",
      title: attr.subjectTitle,
      icon: "activityText64",
      linkHref: `/read/${attr.subjectSlug}`
    };
  }

  propsForResourceAdded(attr) {
    return {
      type: attr.eventType,
      date: attr.createdAt,
      header: "Resource Added",
      dateFormat: "MMMM dd, yyyy",
      title: attr.subjectTitle,
      icon: "activityResource64",
      linkHref: `/projects/${attr.projectSlug}/resource/${attr.subjectSlug}`
    };
  }

  propsForCollectionAdded(attr) {
    return {
      type: attr.eventType,
      date: attr.createdAt,
      header: "Resource Collection Added",
      dateFormat: "MMMM dd, yyyy",
      title: attr.subjectTitle,
      icon: "activityResource64",
      linkHref: `/projects/${attr.projectSlug}/resource-collection/${attr.subjectSlug}`
    };
  }

  render() {
    const tileProps = this.eventProps();
    return (
      <Tile
        hideLink={this.props.hideLink}
        destroyCallback={this.props.destroyCallback}
        itemTag={this.props.itemTag}
        className={this.props.className}
        {...tileProps}
      />
    );
  }
}
