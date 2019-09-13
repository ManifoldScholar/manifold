require 'rails_helper'
require_relative 'base_types'

module ActionCallouts
  class << self

    def request_create_attributes
      {
        title: Type.string,
        kind: Type.enum( ['link', 'read', 'toc', 'download'] ),
        location: Type.enum( ['left', 'right'] ),
        button: Type.string,
        position: Type.integer,
        url: Type.url({ description: 'Required if the kind is "link"' }),
        attachment: Type.attachment,
        project: Type.reference( "#/definitions/Project" ),
        text: Type.reference( "#/definitions/Text" )
      }
    end

    def request_update_attributes
      request_create_attributes.merge({
        removeAttachment: Type.boolean,
      })
    end

    def request_create
      Type.request({
        type: :object,
        properties: request_create_attributes,
        required: [ 'title', 'kind', 'location']
      })
    end

    def request_update
      Type.request({
        type: :object,
        properties: request_update_attributes,
        required: [ 'title', 'kind', 'location']
      })
    end

    def response
      Type.object({
        data: Type.object({
          id: Type.id,
          type: Type.string,
          attributes: Type.object({
            title: Type.string,
            kind: Type.enum( ['link', 'read', 'toc', 'download'] ),
            location: Type.enum( ['left', 'right'] ),
            button: Type.boolean,
            position: Type.integer,
            url: Type.url({ description: 'Required if the kind is "link"' }),
            attachmentStyles: Type.image,
            relationships: Type.object({
              project: Type.relationship_data,
              text: Type.object({
                data: Type.string( nullable: true ) # TODO Find out what data type this is
              })
            }),
            meta: Type.object({
              partial: Type.boolean
            })
          })
        })
      })
    end
  end
end
