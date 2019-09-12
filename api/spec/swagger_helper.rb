require 'rails_helper'

require_relative 'swagger_definitions/base_types'
require_relative 'swagger_definitions/errors'
require_relative 'swagger_definitions/projects'

RSpec.configure do |config|

  # Specify a root folder where Swagger JSON files are generated
  # NOTE: If you're using the rswag-api to serve API descriptions, you'll need
  # to ensure that it's configured to serve Swagger from the same folder
  config.swagger_root = Rails.root.to_s + "/swagger"

  # Define one or more Swagger documents and provide global metadata for each one
  # When you run the 'rswag:specs:to_swagger' rake task, the complete Swagger will
  # be generated at the provided relative path under swagger_root
  # By default, the operations defined in spec files are added to the first
  # document below. You can override this behavior by adding a swagger_doc tag to the
  # the root example_group in your specs, e.g. describe '...', swagger_doc: 'v2/swagger.json'
  config.swagger_docs = {
    'v1/swagger.json' => {
      swagger: '2.0',
      info: {
        title: 'Manifold',
        version: 'v1'
      },
      host: 'localhost:3020', # TODO base this off the .env file
      basePath: '/api/v1',
      schemes: ['http'],
      paths: {},
      tags: [
        {
          name: "Projects",
          description: "Info on the manifold projects",
        },
      ],
      securityDefinitions: {
        apiKey: {
          type: "apiKey",
          name: "Authorization",
          in: "header"
        }
      },
      definitions: {

        #####################################
        ## Frequently Used Data Structures ##
        #####################################

        Attachment: Type.attachment_attributes,
        Image: Type.image_attributes,
        RelationshipData: Type.relationship_data_attributes,

        ######################
        ##      Models      ##
        ######################

        Maker: { description: "TKTKTK placeholder text for Maker" }, # TODO a maker definition

        Project: Projects.response,
        ProjectRequestCreate: Projects.request_create,
        ProjectRequestUpdate: Projects.request_update,
        ProjectResponse: Projects.response,
        ProjectResponseFull: Projects.response_full,
        ProjectsResponse: Type.paginated( Type.reference('#/definitions/ProjectResponse') ),

        Subject: { description: "TKTKTK placeholder text for Subject" }, # TODO a subject definition

        #########################
        ##      Responses      ##
        #########################

        NotFound: Errors.not_found,
      }
    }
  }
end
