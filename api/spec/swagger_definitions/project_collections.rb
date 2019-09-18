require 'rails_helper'
require_relative 'base_types'

module ProjectCollections
  class << self

    def request_create
      Type.request(
        Type.object({
          title: Type.string,
          pendingSlug: Type.string( Type.pending_slug ),
          sortOrder: Type.string({ example: "created_at_asc" }),
          visible: Type.boolean,
          homepage: Type.boolean,
          position: Type.integer,
          icon: Type.string,
          numberOfProjects: Type.integer( nullable: true ),
          featuredOnly: Type.boolean,
          smart: Type.boolean,
          description: Type.string( nullable: true ),
          manuallySorted: Type.boolean,
          tagList: Type.array( type: Type.string ), #TODO check if this is the correct type
          homepageStartDate: Type.date_time( nullable: true ),
          homepageEndDate: Type.date_time( nullable: true ),
          homepageCount: Type.integer( nullable: true )
        })
      )
    end

    def request_update
      request_create()
    end

    def response_attributes
      Type.object({
        title: Type.string,
        slug: Type.string( Type.slug ),
        pendingSlug: Type.string( Type.pending_slug ),
        sortOrder: Type.string({ example: "created_at_asc" }),
        visible: Type.boolean,
        homepage: Type.boolean,
        position: Type.integer,
        icon: Type.string,
        numberOfProjects: Type.integer( nullable: true ),
        featuredOnly: Type.boolean,
        smart: Type.boolean,
        description: Type.string( nullable: true ),
        descriptionFormatted: Type.string,
        descriptionPlaintext: Type.string,
        manuallySorted: Type.boolean,
        projectsCount: Type.integer,
        abilities: Type.object( Type.crud ),
        tagList: Type.array( type: Type.string ), #TODO check if this is the correct type
        homepageStartDate: Type.date( nullable: true ),
        homepageEndDate: Type.date( nullable: true ),
        homepageCount: Type.integer( nullable: true )
     })
    end

    def response
     Type.object({
        id: Type.id,
        type: Type.string,
        attributes: response_attributes,
        relationships: Type.object({
          collectionProjects: Type.object({
            data: Type.array( type: Type.string ), #TODO check if this is the correct type
            links: Type.object({
              first: Type.url,
              last: Type.url
            }),
            meta: Type.object({
              pagination: Type.object({
                perPage: Type.number,
                currentPage: Type.number,
                nextPage: Type.number,
                prevPage: Type.number,
                totalPages: Type.number,
                totalCount: Type.number
              })
            })
          })
        }),
        meta: Type.meta_partial
      })
    end

    def response_full
      Type.object({
        data: Type.object({
          id: Type.id,
          type: Type.string,
          attributes: response_attributes,
          relationships: Type.object({
            collectionProjects: Type.object({
              data: Type.array(
                type: Type.object({
                  id: Type.id,
                  type: Type.string
                })
              ),
              links: Type.object({
                first: Type.url,
                last:  Type.url
               }),
               meta: Type.object({
                 pagination: Type.object({
                   perPage: Type.number,
                   currentPage: Type.number,
                   nextPage: Type.number,
                   prevPage: Type.number,
                   totalPages: Type.number,
                   totalCount: Type.number
                 })
               })
             }),
            subjects: Type.relationship_data,
            projects: Type.relationship_data,
          }),
          meta: Type.meta_partial
         })
       })
    end
  end
end
