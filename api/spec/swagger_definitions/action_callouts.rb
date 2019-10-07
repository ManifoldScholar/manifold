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

    def request_create_params
      {
        title: Type.string,
        kind: Type.enum( ['link', 'read', 'toc', 'download'] ),
        location: Type.enum( ['left', 'right'] ),
        button: Type.boolean,
        position: Type.integer,
        url: Type.url({ description: 'Required if the kind is "link"' }),
        attachmentStyles: Type.image,
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
      Type.response_with_relationships(
        self.request_create_params,
        {
          project: Type.relationship_data,
          text: Type.relationship_data
        }
      )
    end

    def responses
      Type.data_array( self.response() )
    end
  end
end
