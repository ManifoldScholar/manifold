import React, { Component } from "react";
import PropTypes from "prop-types";
import TagList from "../TagList";
import filesize from "filesize";
import pickBy from "lodash/pickBy";
import isNull from "lodash/isNull";
import IconComputed from "global/components/icon-computed";
import Meta from "global/components/meta";
import * as Styled from "./styles";

export default class ResourceMeta extends Component {
  static displayName = "Resource.Meta";

  static propTypes = {
    resource: PropTypes.object,
    layout: PropTypes.string,
    showIcon: PropTypes.bool,
    showTags: PropTypes.bool
  };

  static defaultProps = {
    showIcon: true,
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
        {this.props.showIcon ? (
          <Styled.ResourceIcon aria-hidden="true">
            <IconComputed.Resource icon={attr.kind} size={48} />
          </Styled.ResourceIcon>
        ) : null}

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
