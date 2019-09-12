require 'rails_helper'
require_relative 'base_types'

module Projects
  class << self
    def request_create_attributes
      {
        title: Type.string,
        subtitle: Type.string,
        featured: Type.boolean,
        hashtag: Type.string,
        description: Type.string,
        purchaseUrl: Type.url,
        purchasePriceCurrency: Type.string( Type.currency_code ),
        facebookId: Type.id,
        purchaseCallToAction: Type.string,
        twitterId: Type.id,
        hideActivity: Type.boolean,
        instagramId: Type.id,
        avatar: Type.attachment,
        hero: Type.attachment,
        downloadUrl: Type.url,
        draft: Type.string,
        downloadCallToAction: Type.string,
        publicationDate: Type.date_time,
        cover: Type.attachment,
        avatarColor: Type.string( Type.avatar_color ),
        pendingSlug: Type.string( Type.pending_slug ),
        tagList: Type.array( type: Type.string ),
        darkMode: Type.boolean,
        imageCredits: Type.string,
        standaloneMode: Type.string( Type.standalone_mode ),
        standaloneModePressBarText: Type.string,
        standaloneModePressBarUr: Type.url,
      }
    end

    def required_create_attributes
      ['title']
    end

    def request_update_attributes
      request_create_attributes.merge({
        removeAvatar: Type.boolean,
        removeHero: Type.boolean,
        removeCover: Type.boolean,
      })
    end

    def response_attributes
      Type.object({
        title: Type.string,
        subtitle: Type.string( nullable: true ),
        publicationDate: Type.date_time( nullable: true ),
        createdAt: Type.date_time,
        updatedAt: Type.date_time,
        downloadUrl: Type.url( nullable: true),
        downloadCallToAction: Type.string( nullable: true ),
        avatarStyles: Type.image,
        heroStyles: Type.image,
        recentlyUpdated: Type.boolean,
        updated: Type.boolean,
        slug: Type.string( Type.slug ),
        pendingSlug: Type.string( Type.pending_slug ),
        avatarColor: Type.string( Type.avatar_color ),
        avatarMeta: Type.object({}, { description: I18n.t('attributes.descriptions.avatarMeta') } ),
        draft: Type.boolean,
        abilities: Type.permissions,
        subtitleFormatted: Type.string,
        titleFormatted: Type.string,
        titlePlaintext: Type.string,
        standaloneMode: Type.string( Type.standalone_mode ),
        standaloneModePressBarText: Type.string( nullable: true ),
        standaloneModePressBarUrl: Type.url( nullable: true)
      })
    end

    def response_attributes_full
      Type.object({
        title: Type.string,
        subtitle: Type.string( nullable: true ),
        publicationDate: Type.date_time( nullable: true ),
        createdAt: Type.date_time,
        updatedAt: Type.date_time,
        downloadUrl: Type.string( nullable: true ),
        downloadCallToAction: Type.string( nullable: true ),
        avatarStyles: Type.image,
        heroStyles: Type.image,
        recentlyUpdated: Type.boolean,
        updated: Type.boolean,
        slug: Type.string( Type.slug ),
        pendingSlug: Type.string( Type.pending_slug ),
        avatarColor: Type.string( Type.avatar_color ),
        avatarMeta: Type.object({}, { description: I18n.t('attributes.descriptions.avatarMeta') } ),
        draft: Type.boolean,
        abilities: Type.permissions,
        subtitleFormatted: Type.string,
        titleFormatted: Type.string,
        titlePlaintext: Type.string,
        standaloneMode: Type.string( Type.standalone_mode ),
        standaloneModePressBarText: Type.string( nullable: true),
        standaloneModePressBarUrl: Type.url( nullable: true),
        hashtag: Type.string( nullable: true),
        description: Type.string( nullable: true),
        featured: Type.boolean,
        purchaseUrl: Type.string( nullable: true),
        purchasePriceCurrency: Type.string( nullable: true),
        purchasePrice: Type.integer,
        purchaseCallToAction: Type.string( nullable: true),
        twitterId: Type.string( nullable: true),
        instagramId: Type.string( nullable: true),
        facebookId: Type.string( nullable: true),
        coverStyles: Type.image,
        descriptionFormatted: Type.string,
        resourceKinds: Type.array( type: Type.string, description: "TKTKTKT" ), # TODO description
        resourceTags: Type.array( type: Type.string, description: "TKTKTKT" ), # TODO description
        darkMode: Type.boolean,
        imageCredits: Type.string( nullable: true),
        imageCreditsFormatted: Type.string,
        tagList: Type.array( type: Type.string, description: "TKTKTKT" ), # TODO description
        eventCount: Type.integer,
        metadata: Type.object({
          doi: Type.url( nullable: true),
          edition: Type.string( nullable: true ),
          isbn: Type.string( nullable: true ),
          publisher: Type.string( nullable: true ),
          publisherPlace: Type.string( nullable: true ),
          restrictions: Type.string( nullable: true ),
          rights: Type.string( nullable: true ),
          rightsHolder: Type.string( nullable: true ),
          rightsTerritory: Type.string( nullable: true ),
          version: Type.string( nullable: true )
        }),
        resourceCollectionsCount: Type.integer,
        resourcesCount: Type.integer,
        eventTypes: Type.array( type: Type.string ),
        metadataProperties: Type.array( type: Type.string ),
        citations: Type.object({}, { description: "Citations of the book in a veriety of formats (mla, chicago, apa, etc.)" }),
        hideActivity: Type.boolean,
        metadataFormatted: Type.object({}, { description: "TKTKTKTKTK Seems to be the exact same thing as metadata" }), # TODO question
      })
    end

    def request_create
      Type.object({
        data: Type.object({
          attributes: Type.object(request_create_attributes, { required: required_create_attributes }),
          relationships: Type.object({
            creators: Type.reference('#/definitions/Maker'),
            collaborators: Type.reference('#/definitions/Maker'),
            contributors: Type.reference('#/definitions/Maker'),
            subjects: Type.reference('#/definitions/Subject')
          })
        })
      })
    end

    def request_update
      Type.object({
        data: Type.object({
          attributes: Type.object(request_update_attributes, { required: required_create_attributes }),
          relationships: Type.object({
            creators: Type.reference('#/definitions/Maker'),
            collaborators: Type.reference('#/definitions/Maker'),
            contributors: Type.reference('#/definitions/Maker'),
            subjects: Type.reference('#/definitions/Subject')
          })
        })
      })
    end


    def meta_attributes
      Type.object({
        series_title: Type.string,
        container_title: Type.string,
        isbn: Type.string,
        issn: Type.string,
        doi: Type.string,
        original_publisher: Type.string,
        original_publisher_place: Type.string,
        original_title: Type.string,
        publisher: Type.string,
        publisher_place: Type.string,
        version: Type.string,
        series_number: Type.string,
        edition: Type.string,
        issue: Type.string,
        volume: Type.string,
        rights: Type.string,
        rights_territory: Type.string,
        restrictions: Type.string,
        rights_holder: Type.string,
        resources_doi: Type.string
      })
    end

    def response
      Type.object({
        id: Type.id,
        type: Type.string,
        attributes: response_attributes,
        relationships: Type.object({
          creators: Type.reference('#/definitions/Maker')
        }),
        meta: meta_attributes
      })
    end

    def response_full
      Type.object({
        data: Type.object({
          id: Type.id,
          type: Type.string,
          attributes: response_attributes_full,
          relationships: Type.object({
            creators: Type.relationship_data,
            texts: Type.relationship_data,
            publishedTexts: Type.relationship_data,
            textCategories: Type.relationship_data, # Uses Category Serializer
            events: Type.relationship_data,
            resourceCollections: Type.relationship_data,
            resources: Type.relationship_data,
            subjects: Type.relationship_data,
            twitterQueries: Type.relationship_data,
            permittedUsers: Type.relationship_data,
            contentBlocks: Type.relationship_data,
            actionCallouts: Type.relationship_data,
            contributors: Type.relationship_data # Uses Maker Serializer
          }),
          meta: meta_attributes
        }),
        included: Type.array( type: Type.object({}), description: "TKTKTKT Related texts or events") # TODO description
      })
    end
  end
end
