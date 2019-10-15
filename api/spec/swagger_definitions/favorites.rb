require 'rails_helper'
require_relative 'base_types'
require_relative 'me'

module Favorites
  class << self
    ##############################
    ##   PARAMS & ATTRIBUTES    ##
    ##############################

    def create_request_params
      {
      	relationships: Type.object({
    			favoritable: Type.object({
    				data: Type.object({
    					id: Type.id,
    					type: Type.string
    				})
    			})
    		})
      }
    end

    def create_response_attributes
      Me.get_model
    end

    # def update_request_params
    #   {
    #
    #   }
    # end
    #
    # def update_response_attributes
    #   {
    #
    #   }
    # end

    def get_model_attributes
      {
        favoritableType: Type.string,
        favoritableId: Type.id,
        subjectIds: Type.array({ type: Type.id })
      }
    end

    ##############################
    ##  CRUD OPERATION SCHEMAS  ##
    ##############################
    def create_request
      Type.request(
        Type.object( create_request_params )
      )
    end

    def create_response
      Me.get_model
    end

    # def update_request
    #   Type.request(
    #     Type.object({})
    #   )
    # end
    #
    # def update_response
    #   Type.object({
    #     data: Type.array({
    #       type: Type.response_with_relationships(
    #         get_model_attributes,
    #         { favoritable: Type.relationship_data_attribute }
    #       )
    #     })
    #   })
    # end

    def get_model
      Type.object({
        data: Type.array({
          type: Type.response_with_relationships(
            get_model_attributes,
            { favoritable: Type.relationship_data_attribute }
          )
        })
      })
    end
  end
end
