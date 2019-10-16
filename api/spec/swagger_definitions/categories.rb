require 'rails_helper'
require_relative 'base_types'

module Categories
  class << self

    def response_attributes
      {
        title: Type.string,
        position: Type.integer,
        abilities: Type.object( Type.crud )
      }
    end

    def create_request
      Type.object({
        data: Type.object({
          attributes: Type.object({
            title: Type.string,
            position: Type.integer,
          }),
          relationships: Type.object({
            project: Type.relationship_data_attribute
          })
        })
      })
    end

    def get_resource
      Type.object({
        data: Type.object({
          id: Type.id,
          type: Type.string,
          attributes: Type.object( response_attributes )
        }),
        meta: Type.meta_partial
      })
    end


    def get_collection
      Type.data_array(
        Type.response( response_attributes )
      )
    end
  end
end
