require 'rails_helper'

require_relative 'swagger_definitions/action_callouts'
require_relative 'swagger_definitions/base_types'
require_relative 'swagger_definitions/categories'
require_relative 'swagger_definitions/comments'
require_relative 'swagger_definitions/content_blocks'
require_relative 'swagger_definitions/contacts'
require_relative 'swagger_definitions/errors'
require_relative 'swagger_definitions/makers'
require_relative 'swagger_definitions/me'
require_relative 'swagger_definitions/pages'
require_relative 'swagger_definitions/projects'
require_relative 'swagger_definitions/project_collections'
require_relative 'swagger_definitions/reading_groups'
require_relative 'swagger_definitions/resources'
require_relative 'swagger_definitions/resource_collections'
require_relative 'swagger_definitions/subjects'
require_relative 'swagger_definitions/tags'
require_relative 'swagger_definitions/texts'
require_relative 'swagger_definitions/users'

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
        {
          name: "Action Callouts",
          description: "TKTKTKT",
        },
        {
          name: "Categories",
          description: "TKTKTKT",
        },
        {
          name: "Comments",
          description: "TKTKTKT",
        },
        {
          name: "users",
          description: "Readers, authors, admins and other user info",
        },
        {
          name: "tokens",
          description: "Getting tokens to grant users access to more personalized elements of the site",
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

        ActionCalloutRequestCreate: ActionCallouts.request_create,
        ActionCalloutRequestUpdate: ActionCallouts.request_update,
        ActionCalloutResponse: ActionCallouts.response,

        CategoryResponse: Categories.response,
        CategoryResponses: Categories.responses,
        CategoryRequestUpdate: Categories.request_update,
        CategoryRequestCreate: Categories.request_create,

        CommentResponse: Comments.response,
        CommentRequestUpdate: Comments.request_update,

        ContentBlockResponse: ContentBlocks.response,
        ContentBlockRequestUpdate: ContentBlocks.request_update,

        ContactRequestCreate: Contacts.request_create,
        ContactResponseError: Contacts.error,

        Maker: Makers.relationship,
        MakerResponse: Makers.response,
        MakersResponse: Type.paginated( Makers.response ),
        MakerRequestCreate: Makers.request_create,
        MakerRequestUpdate: Makers.request_update,

        MeResponse: Me.response,
        MeRequestUpdate: Me.request_update,

        PageResponse: Pages.response,
        PageResponseFull: Pages.response_full,
        PagesResponse: Pages.responses,
        PageRequestCreate: Pages.request_create,
        PageRequestUpdate: Pages.request_update,

        Project: Projects.response,
        ProjectRequestCreate: Projects.request_create,
        ProjectRequestUpdate: Projects.request_update,
        ProjectResponse: Projects.response,
        ProjectResponseFull: Projects.response_full,
        ProjectsResponse: Type.paginated( Type.reference('#/definitions/ProjectResponse') ),

        ProjectCollectionResponse: ProjectCollections.response,
        ProjectCollectionResponseFull: ProjectCollections.response_full,
        ProjectCollectionRequestCreate: ProjectCollections.request_create,
        ProjectCollectionRequestUpdate: ProjectCollections.request_update,

        ReadingGroupResponse: ReadingGroups.response,
        ReadingGroupsResponse: ReadingGroups.responses,
        ReadingGroupRequestCreate: ReadingGroups.create_request,
        ReadingGroupRequestUpdate: ReadingGroups.update_request,
        ReadingGroupUpdateResponse: ReadingGroups.update_response,

        ResourceResponse: Resources.response_full,
        ResourceRequestUpdate: Resources.request_update,
        ResourcesResponse: Type.paginated( Resources.response ),

        ResourceCollectionResponse: ResourceCollections.response,
        ResourceCollectionsResponse: ResourceCollections.get_models,
        ResourceCollectionRequestCreate: ResourceCollections.request_create,
        ResourceCollectionRequestUpdate: ResourceCollections.request_update,

        SubjectResponse: Subjects.response,
        SubjectsResponse: Type.paginated( Subjects.response ),
        SubjectRequestCreate: Subjects.request_create,
        SubjectRequestUpdate: Subjects.request_update,

        TagsResponse: Tags.responses,

        TextResponse: Texts.response,
        TextResponseFull: Texts.response_full,
        TextRequestUpdate: Texts.request_update,
        TextRequestCreate: Texts.request_create,

        UserRequestCreate: Users.request_create,
        User: Users.response,
        UserResponse: Users.response,
        UsersResponse: Type.paginated( Users.response ),

        Subject: { description: "TKTKTK placeholder text for Subject" }, # TODO a subject definition
        Text: { description: "TKTKTK placeholder text for Text" }, # TODO a subject definition
        #########################
        ##      Responses      ##
        #########################

        NotFound: Errors.not_found,
        TokenErrors: Errors.token,
      }
    }
  }
end
