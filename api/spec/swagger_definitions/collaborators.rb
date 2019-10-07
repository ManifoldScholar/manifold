require 'rails_helper'
require_relative 'base_types'

module Collaborators
  class << self

    ###########################
    ## PARAMS AND ATTRIBUTES ##
    ###########################
    def create_request_params
      { role: Type.string }
    end

    def create_response_attributes
      create_request_params
    end

    # def update_request_params
    #   {}
    # end
    #
    # def update_response_params
    #   {}
    # end

    def get_model_attributes
      create_request_params
    end

    def relationship_attributes
      {
        maker: Type.relationship_data_attribute,
        collaboratable: Type.relationship_data_attribute
      }
    end

    def included_attributes
      {
        firstName: Type.string,
        lastName: Type.string,
        middleName: Type.string({ nullable: true }),
        displayName: Type.string({ nullable: true }),
        fullName: Type.string,
        avatarStyles: Type.image,
        suffix: Type.string({ nullable: true }),
        abilities: Type.object( Type.crud ),
        prefix: Type.string({ nullable: true })
      }
    end

    def included
      Type.array(
        type: Type.response(
          included_attributes
        )
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
      Type.response_with_relationships(
        create_response_attributes,
        relationship_attributes
      )
    end

    # def update_request
    #   # Type.request( update_request_params )
    # end
    #
    # def update_response
    #   # Type.response_with_relationships()
    #   # Type.response() # no relationships
    # end

    def get_model
      Type.object({
        data: Type.response_with_relationships(
          get_model_attributes,
          relationship_attributes
        )
      })
    end

    def get_models
      Type.object({
        data: Type.array( type: get_model ),
        included: included
      })
    end
  end
end
