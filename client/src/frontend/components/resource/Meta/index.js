import { Component } from "react";
import PropTypes from "prop-types";
import TagList from "../TagList";
import { filesize } from "filesize";
import pickBy from "lodash/pickBy";
import isNull from "lodash/isNull";
import Meta from "global/components/meta";
import * as Styled from "./styles";

export default class ResourceMeta extends Component {
  static displayName = "Resource.Meta";

  static propTypes = {
    resource: PropTypes.object,
    layout: PropTypes.string,
    showTags: PropTypes.bool
  };

  static defaultProps = {
    showTags: true
  };

  generateResourceMetadataMap(baseMeta, resource) {
    const keys = Object.keys(baseMeta).sort();
    const metadata = { ...baseMeta };
    const attr = resource.attributes;

    if (attr.attachmentFileSize) {
      metadata.fileSize = `${filesize(attr.attachmentFileSize, { round: 0 })}`;
      keys.unshift("fileSize");
    }

    if (attr.attachmentExtension) {
      metadata.fileFormat = attr.attachmentExtension;
      keys.unshift("fileFormat");
    }

    metadata.createdOn = attr.createdAt;
    keys.unshift("createdOn");

    metadata.type = attr.kind.charAt(0).toUpperCase() + attr.kind.slice(1);
    keys.unshift("type");

    return { metadata, keys };
  }

  render() {
    const attr = this.props.resource.attributes;
    const exclude = ["altText"];
    const filteredMetadata = pickBy(
      attr.metadataFormatted,
      (v, k) => !exclude.includes(k) && !isNull(v) && v.length > 0
    );

    const { metadata, keys } = this.generateResourceMetadataMap(
      filteredMetadata,
      this.props.resource
    );

    return (
      <Styled.Meta>
        <h2 className="screen-reader-text">Metadata</h2>
        <Meta.List
          map={keys}
          metadata={metadata}
          level={this.props.layout}
          sortByLength={false}
        />
        {this.props.showTags ? (
          <TagList resource={this.props.resource} />
        ) : null}
      </Styled.Meta>
    );
  }
}
