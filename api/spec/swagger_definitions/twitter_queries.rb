require 'rails_helper'
require_relative 'base_types'

# needs to be named with "Schema" or it has a namespace
# collision with another twitter query class
module TwitterQuerySchema
  class << self
    ##############################
    ##   PARAMS & ATTRIBUTES    ##
    ##############################
    def create_request_params
      {
        query: Type.string,
        active: Type.boolean,
        eventsCount: Type.integer,
        resultType: Type.string,
        displayName: Type.string
      }
    end

    def create_response_attributes
      create_request_params.merge({
        createdAt: Type.date_time,
        updatedAt: Type.date_time
      })
    end

    def get_model_attributes
      create_response_attributes
    end

    def relationship_attributes
      { project: Type.relationship_data_attribute }
    end

    def model
      Type.response_with_relationships(
        get_model_attributes,
        relationship_attributes
      )
    end

    ##############################
    ##  CRUD OPERATION SCHEMAS  ##
    ##############################
    def create_request
      Type.request(
        Type.object(create_request_params )
      )
    end

    def create_response
      Type.object({ data: model })
    end

    def get_model
      Type.object({ data: model })
    end

    def get_models
      Type.data_array( model )
    end
  end
end
