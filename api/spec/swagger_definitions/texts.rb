require_relative 'base_types'

module Texts
  class << self
    def included
      Type.array(
        type: Type.object({
          id: Type.id,
          type: Type.string,
          attributes: Type.object({
            title: Type.string,
            subtitle: Type.string({ nullable: true }),
            publicationDate: Type.string({ nullable: true }),
            createdAt: Type.date_time,
            updatedAt: Type.date_time,
            downloadUrl: Type.url({ nullable: true }),
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
            abilities: Type.object({
              readDrafts: Type.boolean,
              readLog: Type.boolean,
              manageResources: Type.boolean,
              createResources: Type.boolean,
              manageResourceCollections: Type.boolean,
              createResourceCollections: Type.boolean,
              managePermissions: Type.boolean,
              createPermissions: Type.boolean,
              manageTexts: Type.boolean,
              createTexts: Type.boolean,
              manageTwitterQueries: Type.boolean,
              createTwitterQueries: Type.boolean,
              manageEvents: Type.boolean,
              manageSocials: Type.boolean,
              updateMakers: Type.boolean,
              create: Type.boolean,
              read: Type.boolean,
              update: Type.boolean,
              delete: Type.boolean
            }),
            subtitleFormatted: Type.string,
            titleFormatted: Type.string,
            titlePlaintext: Type.string,
            standaloneMode: Type.string,
            standaloneModePressBarText: Type.string({ nullable: true }),
            standaloneModePressBarUrl: Type.string({ nullable: true })
          }),
          relationships: Type.object({
            creators: Type.object({
              data: Type.array( type: Type.string ) #TODO not sure about this type
            })
          }),
          meta: Type.meta_partial
        })
      )
    end

    def request_update
      Type.request(
        Type.object({
          title: Type.string,
          language: Type.string,
          position: Type.string,
          description: Type.string,
          publicationDate: Type.date_time,
          text: Type.attachment,
          rights: Type.string,
          sectionKind: Type.string,
          subtitle: Type.string,
          published: Type.string,
          pendingSlug: Type.string
        })
      )
    end

    def request_create
      request_update()
    end

    def text_response_attributes
      {
        title: Type.string,
        creatorNames: Type.string,
        createdAt: Type.date_time,
        updatedAt: Type.date_time,
        startTextSectionId: Type.id({ nullable: true }),
        published: Type.boolean,
        annotationsCount: Type.integer,
        highlightsCount: Type.integer,
        bookmarksCount: Type.integer,
        age: Type.integer,
        position: Type.integer,
        publicationDate: Type.date_time({ nullable: true }),
        coverStyles: Type.image,
        subtitle: Type.string({ nullable: true }),
        slug: Type.string({ nullable: true }),
        pendingSlug: Type.string,
        sectionKind: Type.string({ nullable: true }),
        titleFormatted: Type.string({ nullable: true }),
        titlePlaintext: Type.string({ nullable: true }),
        subtitleFormatted: Type.string({ nullable: true }),
        subtitlePlaintext: Type.string({ nullable: true }),
        description: Type.string({ nullable: true }),
        descriptionFormatted: Type.string,
        toc: Type.array( type: Type.string ), #TODO not sure about this type
        tocSection: Type.string({ nullable: true })
      }
    end

    def text_response_attributes_full
      text_response_attributes().merge({
        metadata: Type.object({}),
        metadataProperties: Type.array( type: Type.string ),
        metadataFormatted: Type.object({}),
        citations: Type.object({}),
        spine: Type.array( type: Type.string ), #TODO unsure about all these
        sectionsMap: Type.array( type: Type.string ), #TODO unsure about all these
        abilities: Type.object({})
      })
    end

    def response_full
      Type.object({
        data: Type.object({
          id: Type.id,
          type: Type.string,
          attributes: Type.object(text_response_attributes_full()),
          relationships: Type.object({
            project: Type.object({
              data: Type.object({
                id: Type.id,
                type: Type.string
              }),
              stylesheets: Type.relationship_data,
              creators: Type.relationship_data,
              contributors: Type.relationship_data,
              textSections: Type.relationship_data,
              tocSection: Type.relationship_data
            }),
            category: Type.object({
              data: Type.nullable_string
            })
          }),
          meta: Type.meta_partial
        }),
        included: included()
      })
    end

    def response
      Type.object({
        data: Type.array(
          type: Type.object({
            id: Type.id,
            type: Type.string,
            attributes: Type.object(text_response_attributes()),
            relationships: Type.object({
              project: Type.object({
                data: Type.object({
                  id: Type.id,
                  type: Type.string
                })
              }),
              category: Type.object({
                data: Type.nullable_string
              })
            }),
            meta: Type.meta_partial
          })
        )
      })
    end
  end
end
