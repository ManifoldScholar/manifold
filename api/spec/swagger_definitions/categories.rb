require 'rails_helper'
require_relative 'base_types'

module Categories
  class << self

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
          attributes: Type.object({
            title: Type.string,
            position: Type.integer,
            abilities: Type.object( Type.crud )
          })
        }),
        meta: Type.meta_partial
      })
    end
  end
end
