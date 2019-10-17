require 'rails_helper'
require_relative 'base_types'

module ContentBlocks
  class << self
    def create_request_params
      {
        type: Type.string,
        position: Type.integer,
        visible: Type.boolean,
        configurable: Type.boolean,
        orderable: Type.boolean,
        hideable: Type.boolean,
        renderable: Type.boolean,
        incompleteRenderAttributes: Type.array( type: Type.string ),
      }
    end

    def create_response_attributes
      create_request_params.merge({
        showAllCollections: Type.boolean,
        title: Type.string( nullable: true )
      })
    end

    def create_request
      Type.request(
        Type.object( create_request_params )
      )
    end

    def update_request
      Type.object({
        data: Type.object({
          id: Type.id,
          type: Type.string,
          attributes: Type.object({
            type: Type.string,
            position: Type.integer,
            visible: Type.boolean,
            incomplete_render_attributes: Type.array( type: Type.string ),
          })
        })
      })
    end

    def response
      Type.object({})
      # Type.response_with_relationships(
      #   create_response_attributes,
      #   Type.relationships(['project', 'featuredCollections'])
      # )
    end

    def responses
      Type.data_array( response )
    end
  end
end
