require 'rails_helper'
require_relative 'base_types'

module Pages
  class << self

    def request_create
      Type.request(
        Type.object({
          title: Type.string,
          pendingSlug: Type.string,
          navTitle: Type.string,
          body: Type.string,
          showInFooter: Type.boolean,
          showInHeader: Type.boolean,
          hidden: Type.boolean,
          externalLink: Type.url,
          isExternalLink: Type.boolean,
          purpose: Type.string,
          openInNewTab: Type.boolean
        })
      )
    end

    def request_update
      request_create()
    end

    def response_attributes
      {
        slug: Type.string,
        pendingSlug: Type.string,
        title: Type.string,
        navTitle: Type.string,
        showInFooter: Type.boolean,
        showInHeader: Type.boolean,
        createdAt: Type.date_time,
        updatedAt: Type.date_time,
        hidden: Type.boolean,
        bodyFormatted: Type.string,
        abilities: Type.object( Type.crud ),
        purpose: Type.string,
        isExternalLink: Type.boolean,
        externalLink: Type.url,
        openInNewTab: Type.boolean,
      }
    end

    def response_full_attributes
      response_attributes.merge({ body: Type.string })
    end

    def response
      Type.object({
        data: Type.object({
          id: Type.id,
          type: Type.string( example: 'pages' ),
          attributes: Type.object( response_attributes )
        })
      })
    end

    def responses
      Type.object({
        data: Type.array(
          type: Type.object({
            id: Type.id,
            type: Type.string( example: 'pages' ),
            attributes: Type.object( response_attributes )
          })
        )
      })
    end

    def response_full
      Type.object({
        data: Type.object({
          id: Type.id,
          type: Type.string( example: 'pages' ),
          attributes: Type.object( response_full_attributes )
        })
      })
    end
  end
end
