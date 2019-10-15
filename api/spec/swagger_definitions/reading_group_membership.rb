require 'rails_helper'
require_relative 'base_types'

module ReadingGroupMembership
  class << self
    ##############################
    ##   PARAMS & ATTRIBUTES    ##
    ##############################
    def create_request_params
      {
        type: :object,
        properties: {
          user: Type.object({}),
          readingGroup: Type.object({})
        },
        required: [ 'user', 'readingGroup' ]
      }
    end

    def create_response_attributes
      {

      }
    end

    def update_request_params
      {

      }
    end

    def update_response_attributes
      {

      }
    end

    def get_model_attributes
      {

      }
    end

    def model
      Type.response_with_relationships(
        get_model_attributes,
        relationship_attributes
      )
      Type.response( get_model_attributes ) # no relationships
    end

    ##############################
    ##  CRUD OPERATION SCHEMAS  ##
    ##############################
    def create_request
      Type.request()
    end

    def create_response
      Type.object({ data: model })
    end

    def update_request
      Type.request(
        Type.object({})
      )
    end

    def update_response
      Type.object({ data: model })
    end

    def get_model
      Type.object({ data: model })
    end

    def get_models
      Type.data_array( model ) # it could be just a data array of models
      Type.paginated( model )  # or maybe it is a data array with pagination
    end
  end
end
