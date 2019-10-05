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

    def request_create
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

    def request_update
      request_create()
    end

    def response
      Type.object({
        data: Type.object({
          id: Type.id,
          type: Type.string,
          attributes: Type.object(self.response_attributes)
        }),
        meta: Type.meta_partial
      })
    end


    def responses
      Type.data_array(
        Type.response(self.response_attributes)
      )
    end
  end
end
