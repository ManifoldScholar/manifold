require 'rails_helper'
require_relative 'base_types'

module Makers
  class << self

    # TODO check if makers need a user relationship in the docs

    def request_create_attributes
      {
        firstName: Type.string( description: 'requires at least one of these fields' ),
        lastName: Type.string( description: 'requires at least one of these fields' ),
        middleName: Type.string( nullable: true ),
        suffix: Type.string( nullable: true ),
        avatar: Type.attachment,
        name: Type.string( nullable: true ),
        prefix: Type.string( nullable: true )
      }
    end

    def request_create
      Type.request(
        Type.object(request_create_attributes)
      )
    end

    def request_update
      Type.request(
        Type.object(
          request_create_attributes.merge({
              removeAvatar: Type.boolean
            }
          )
        )
      )
    end

    def relationship
      Type.object({
        data: Type.array(
          type: Type.object({
            id: Type.id,
            type: Type.string
          })
        )
      })
    end

    def response
      Type.object({
        data: Type.object({
          id: Type.id,
          type: Type.string,
          attributes: Type.object({
            firstName: Type.string,
            lastName: Type.string,
            middleName: Type.string( nullable: true ),
            displayName: Type.string( nullable: true ),
            fullName: Type.string,
            avatarStyles: Type.image,
            suffix: Type.string( nullable: true ),
            abilities: Type.object( Type.crud ),
            prefix: Type.string( nullable: true )
          })
        }),
        meta: Type.meta_partial
      })
    end
  end
end
