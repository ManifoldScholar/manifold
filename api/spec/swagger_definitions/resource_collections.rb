require_relative 'base_types'

module ResourceCollections
  class << self

    #############
    ## REQUEST ##
    #############
    def request_create_attributes
      {
        title: Type.string,
        description: Type.string,
        thumbnail: Type.attachment,
        pendingSlug: Type.string
      }
    end

    def request_create
      Type.submit_wrapper(Type.object(request_create_attributes))
    end

    def request_update_attributes
      request_create.merge({ remove_thumbnail: Type.boolean })
    end

    def request_update
      Type.submit_wrapper(Type.object(request_update_attributes))
    end

    ##############
    ## RESPONSE ##
    ##############

    def response
      Type.data_response_attributes({
       id: Type.id,
       type: Type.string,
       attributes: Type.object({
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
       }),
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
    end
  end
end
