require 'rails_helper'
require_relative 'base_types'

module Comments
  class << self

    def comment
      {
        body: Type.string,
        parent_id: Type.id,
        created_at: Type.date_time,
        flags_count: Type.integer,
        flagged: Type.boolean,
        abilities: Type.object( Type.crud ),
        deleted: Type.boolean,
        children_count: Type.integer,
        sort_order: Type.integer,
        author_created: Type.boolean,
      }
    end

    def request_create
      Type.request({
        attributes: HashHelper.pick(comment, [
          :body,
          :parent_id,
          :deleted
        ])
      })
    end

    def request_update
      Type.request({
        attributes: HashHelper.pick(comment, [
          :body,
          :deleted
        ])
      })
    end

    def get_resource
      Type.response({
        type: :resource,
        attributes: comment,
        relationships: {
          singular: [ :creator ]
        }
      })
    end
  end
end
