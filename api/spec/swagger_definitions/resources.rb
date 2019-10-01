require_relative 'base_types'

module Resources
  class << self

    ###############
    ## FRAGMENTS ##
    ###############

    def response_attributes
      {
        title: Type.string,
        titlePlaintext: Type.string,
        titleFormatted: Type.string,
        kind: Type.string,
        subKind: Type.nullable_string,
        caption: Type.nullable_string,
        captionFormatted: Type.string,
        captionPlaintext: Type.string,
        projectId: Type.string,
        altText: Type.nullable_string,
        attachmentStyles: Type.image,
        variantThumbnailStyles: Type.image,
        metadataFormatted: Type.object({}),
        externalType: Type.nullable_string,
        externalId: Type.nullable_string,
        externalUrl: Type.url,
        slug: Type.string,
        pendingSlug: Type.string,
        downloadable: Type.boolean,
        createdAt: Type.date_time,
        minimumWidth: Type.integer({ nullable: true }),
        minimumHeight: Type.integer({ nullable: true }),
        projectSlug: Type.string,
        variantPosterStyles: Type.image
      }
    end

    def response_attributes_full
      response_attributes.merge({
        attachmentFileName: Type.string({ nullable: true }),
        attachmentExtension: Type.string({ nullable: true }),
        attachmentContentType: Type.string({ nullable: true }),
        attachmentFileSize: Type.string({ nullable: true }),
        updatedAt: Type.date_time,
        descriptionFormatted: Type.string,
        descriptionPlaintext: Type.string,
        description: Type.string({ nullable: true }),
        fingerprint: Type.string,
        allowHighRes: Type.boolean,
        allowDownload: Type.boolean,
        highResUrl: Type.string({ nullable: true }),
        highResFileName: Type.string({ nullable: true }),
        highResContentType: Type.string({ nullable: true }),
        highResFileSize: Type.string({ nullable: true }),
        variantFormatOneFileName: Type.string({ nullable: true }),
        variantFormatOneContentType: Type.string({ nullable: true }),
        variantFormatOneFileSize: Type.string({ nullable: true }),
        variantFormatOneUrl: Type.string({ nullable: true }),
        variantFormatTwoUrl: Type.string({ nullable: true }),
        variantFormatTwoFileName: Type.string({ nullable: true }),
        variantFormatTwoContentType: Type.string({ nullable: true }),
        variantFormatTwoFileSize: Type.string({ nullable: true }),
        variantThumbnailFileName: Type.string({ nullable: true }),
        variantThumbnailContentType: Type.string({ nullable: true }),
        variantThumbnailFileSize: Type.string({ nullable: true }),
        variantPosterFileName: Type.string({ nullable: true }),
        variantPosterContentType: Type.string({ nullable: true }),
        variantPosterFileSize: Type.string({ nullable: true }),
        transcriptFileName: Type.string({ nullable: true }),
        transcriptContentType: Type.string({ nullable: true }),
        transcriptFileSize: Type.string({ nullable: true }),
        translationFileName: Type.string({ nullable: true }),
        translationContentType: Type.string({ nullable: true }),
        translationFileSize: Type.string({ nullable: true }),
        embedCode: Type.string({ nullable: true }),
        iframeAllowFullscreen: Type.boolean,
        downloadableKind: Type.boolean,
        metadata: Type.object({}),
        metadataProperties: Type.array( type: Type.string ),
        abilities: Type.object( Type.crud ),
        tagList: Type.array( type: Type.string )
      })
    end

    def included_attributes
      {
        title: Type.string,
        subtitle: Type.string({ nullable: true }),
        publicationDate: Type.string({ nullable: true }),
        createdAt: Type.date_time,
        updatedAt: Type.date_time,
        downloadUrl: Type.string({ nullable: true }),
        downloadCallToAction: Type.string({ nullable: true }),
        avatarStyles: Type.image,
        heroStyles: Type.image,
        recentlyUpdated: Type.boolean,
        updated: Type.boolean,
        slug: Type.string,
        pendingSlug: Type.string,
        avatarColor: Type.string,
        avatarMeta: Type.object({}),
        draft: Type.boolean,
        abilities: Type.object( Type.crud ),
        subtitleFormatted: Type.string,
        titleFormatted: Type.string,
        titlePlaintext: Type.string,
        standaloneMode: Type.string,
        standaloneModePressBarText: Type.string({ nullable: true }),
        standaloneModePressBarUrl: Type.string({ nullable: true }),
        finished: Type.boolean
      }
    end

    def included
      Type.array({
        type: Type.response_with_relationships(
          self.included_attributes,
          { creators: Type.relationship_data_attributes }
        )
      })
    end

    def response_relationships
      {
        collectionResources: Type.object({
          data: Type.array( type: Type.string ) # TODO not sure about this data type
        })
      }
    end

    # TODO have zach check out the behavior of a resource update.
    # There seems to be a lot of different possible combinations with
    # each kind and the different fields that are usable depending on the kind
    def request_update_fields
      {
        title: Type.string,
        kind: Type.enum([
          'image',
          'video',
          'audio',
          'link',
          'pdf',
          'document',
          'file',
          'spreadsheet',
          'presentation',
          'interactive'
        ], {
          description: "Picking each of these options makes different fields required"
        }),
        subKind: Type.string({
          nullable: true,
          description: "'external_video' option is only possible if choosing a 'video' kind"
        }),
        caption: Type.nullable_string,
        altText: Type.nullable_string,
        externalType: Type.string({
          nullable: true,
          example: "youtube",
          description: "If the subKind is an external_video, what site the external video is hosted on"
        }),
        externalId: Type.string({ nullable: true }),
        externalUrl: Type.string({ nullable: true }),
        pendingSlug: Type.string,
        downloadable: Type.boolean,
        minimumWidth: Type.integer({ nullable: true }),
        minimumHeight: Type.integer({ nullable: true }),
      }
    end

    ################
    ## STRUCTURES ##
    ################

    def request_update
      Type.request(
        Type.object(request_update_fields)
      )
    end

    def request_create

    end

    def response
      Type.object({
        id: Type.id,
        type: Type.string,
        attributes: Type.object( self.response_attributes ),
        relationships: Type.object( self.response_relationships ),
        meta: Type.meta_partial
      })
    end

    def response_full
      Type.object({
        data: Type.object({
          id: Type.id,
          type: Type.string,
          attributes: Type.object( self.response_attributes_full ),
          relationships: Type.object( self.response_relationships ),
          meta: Type.meta_partial,
          included: self.included()
        })
      })
    end
  end
end
