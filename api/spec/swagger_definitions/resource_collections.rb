require_relative 'base_types'

module ResourceCollections
  class << self

    #############
    ## REQUEST ##
    #############
    def request_create_params
      {
        title: Type.string,
        description: Type.string,
        thumbnail: Type.attachment,
        pendingSlug: Type.string
      }
    end

    def request_create
      Type.request(
        Type.object(request_create_params)
      )
    end

    def request_update_params
      request_create_params.merge({ removeThumbnail: Type.boolean })
    end

    def request_update
      Type.request(
        Type.object(request_update_params)
      )
    end

    ##############
    ## RESPONSE ##
    ##############

    def response
      Type.object(
        Type.data_response_hash(
          Type.object({
            title: Type.string,
            titleFormatted: Type.string,
            createdAt: Type.date_time,
            description: Type.string( nullable: true ),
            descriptionFormatted: Type.string,
            projectId: Type.id,
            resourceKinds: Type.array( type: Type.string ), # TODO not sure about this data type
            resourceTags: Type.array( type: Type.string ), # TODO not sure about this data type
            thumbnailStyles: Type.image,
            collectionResourcesCount: Type.integer,
            slug: Type.string,
            pendingSlug: Type.string,
            abilities: Type.object( Type.crud )
          })
        ).merge({
          relationships: Type.object({
            resources: Type.relationship_data,
            project: Type.object({
              data: Type.object({
                id: Type.id,
                type: Type.string
              })
            })
          })
        })
      )
    end

    def get_models
      Type.paginated( response )
    end
  end
end
