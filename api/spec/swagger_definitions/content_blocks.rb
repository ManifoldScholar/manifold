require 'rails_helper'
require_relative 'base_types'

module ContentBlocks
  class << self
    def request_create
      Type.object({
        data: Type.object({
          attributes: Type.object({
            type: Type.string,
            position: Type.integer,
            visible: Type.boolean,
            configurable: Type.boolean,
            orderable: Type.boolean,
            hideable: Type.boolean,
            renderable: Type.boolean,
            incomplete_render_attributes: Type.array( type: Type.string ),
          })
        })
      })
    end

    def request_update
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
      Type.object({
        data: Type.object({
          id: Type.id,
          type: Type.string,
          attributes: Type.object({
            type: Type.string,
            position: Type.integer,
            visible: Type.boolean,
            configurable: Type.boolean,
            orderable: Type.boolean,
            hideable: Type.boolean,
            abilities: Type.object( Type.crud ),
            renderable: Type.boolean,
            incompleteRenderAttributes: Type.array( type: Type.string ),
            showAllCollections: Type.boolean,
            title: Type.string( nullable: true )
          }),
          relationships: Type.object({
            project: Type.object({
              data: Type.object({
                id: Type.id,
                type: Type.string,
              })
            }),
            featuredCollections: Type.object({
              data: Type.array({
                type: Type.object({
                  id: Type.id,
                  type: Type.string({ example: "resourceCollections" })
                })
              })
            })
          }),
          meta: Type.object({
            partial: Type.boolean
          })
        })
      })
    end
  end
end
