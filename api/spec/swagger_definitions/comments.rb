require 'rails_helper'
require_relative 'base_types'

module Comments
  class << self

    def request_create
      Type.request(
        Type.object({
          body: Type.string,
          parent_id: Type.id,
          deleted: Type.boolean
        })
      )
    end

    def request_update
      Type.request(
        Type.object({
          body: Type.string,
          deleted: Type.boolean
        })
      )
    end

    def response
      Type.object({
        data: Type.object({
          id: Type.id,
          type: Type.string,
          attributes: Type.object({
            body: Type.string,
            parent_id: Type.id,
            created_at: Type.date_time,
            flags_count: Type.integer,
            flagged: Type.boolean,
            abilities: Type.object( Type.crud ), # TODO check that crud is the right abilities type
            deleted: Type.boolean,
            children_count: Type.integer,
            sort_order: Type.integer,
            author_created: Type.boolean,
          }),
          relationships: Type.object({
            creator: Type.reference('#/definitions/User') # TODO what kind of user information is in a creator
          })
        }),
        meta: Type.meta_partial
      })
    end
  end
end
