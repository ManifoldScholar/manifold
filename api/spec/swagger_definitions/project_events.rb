require 'rails_helper'
require_relative 'base_types'

module ProjectEvents
  class << self
    ##############################
    ##   PARAMS & ATTRIBUTES    ##
    ##############################
    def get_model_attributes
      {
        eventType:             Type.string({ example: "project_created" }),
        eventUrl:              Type.url({ nullable: true }),
        subjectId:             Type.id,
        subjectType:           Type.string,
        subjectSlug:           Type.string,
        subjectTitle:          Type.string,
        subjectSubtitle:       Type.string({ nullable: true }),
        attributionName:       Type.string,
        attributionUrl:        Type.url({ nullable: true }),
        attributionIdentifier: Type.string({ nullable: true }),
        excerpt:               Type.string({ nullable: true }),
        projectId:             Type.id,
        projectSlug:           Type.string,
        eventTitle:            Type.string,
        eventSubtitle:         Type.string({ nullable: true }),
        createdAt:             Type.date_time,
        subjectTitleFormatted: Type.string({ example: "<p>A project title</p>" })
      }
    end

    ##############################
    ##  CRUD OPERATION SCHEMAS  ##
    ##############################

    def get_model
      Type.response( get_model_attributes )
    end

    def get_models
      Type.paginated( get_model )
    end
  end
end
