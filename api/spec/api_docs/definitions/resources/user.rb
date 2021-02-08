module APIDocs
  module Definitions
    module Resources
      class User

        BODY_RESPONSE_DESCRIPTION = <<~HEREDOC.freeze
          Some user data is private and only returned if the user resource being returned is the same as the user requesting the resource, or if the user requesting the user resource is authorized to update that user. Private data includes the following attributes:
          * email
          * createdAt
          * role
          * kind
        HEREDOC

        BODY_REQUEST_DESCRIPTION = <<~HEREDOC.freeze
          The `role` attribute may only be set or updated by admin users.
        HEREDOC

        REQUIRED_CREATE_ATTRIBUTES = [
          :name,
          :email,
          :first_name,
          :last_name,
          :password
        ].freeze

        REQUEST_ATTRIBUTES = {
          name: Types::String,
          password: Types::String,
          password_confirmation: Types::String.meta(description: "Only used when creating an account for yourself. Not needed for admin users creating a new user."),
          remove_avatar: Types::Bool,
          avatar: Types::Serializer::Upload,
          class_abilities: Types::Hash, # TODO: Flesh out class abilities
          persistent_ui: Types::Hash.schema(
            reader: Types::Hash.schema(
              colors: Types::Hash, # TODO: Flesh out class abilities
              typography: Types::Hash, # TODO: Flesh out class abilities
              reading_groups: Types::Hash # TODO: Flesh out class abilities
              ),
              locale: Types::Hash
          ),
          notification_preferences_by_kind: Types::Array.of(
            Types::Hash.schema(
              type: Types::Hash.schema(
                # TODO: Check that these notification preferences are correct for the users attribute
                digest: Types::Serializer::NotificationPreference,
                projects: Types::Serializer::NotificationPreference,
                replies_to_me: Types::Serializer::NotificationPreference,
                followed_projects: Types::Serializer::NotificationPreference,
                flagged_resources: Types::Serializer::NotificationPreference,
                digest_comments_and_annotations: Types::Serializer::NotificationPreference,
                project_comments_and_annotations: Types::Serializer::NotificationPreference
              )
            )
          ),
          # TODO: Add a description for how this should be used
          unsubscribe: Types::Bool
        }.freeze

        class << self

          include APIDocs::Definitions::Resource

          def create_attributes
            request_attributes.except(:unsubscribe, :remove_avatar)
          end

        end
      end
    end
  end
end
