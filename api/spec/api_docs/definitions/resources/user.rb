module ApiDocs
  module Definition
    module Resource
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

        READ_ONLY = [
          :abilities,
          :kind,
          :created_at,
          :updated_at,
          :full_name,
          :avatar_styles,
          :is_current_user
        ].freeze

        WRITE_ONLY = [
          :name,
          :password,
          :password_confirmation,
          :avatar,
          :remove_avatar,
          :notification_preferences_by_kind,
          :persistent_ui,
          :unsubscribe
        ].freeze

        REQUIRED_CREATE_ATTRIBUTES = [
          :name,
          :email,
          :password,
          :password_confirmation
        ].freeze

        REQUIRED_UPDATE_ATTRIBUTES = [
        ].freeze

        ATTRIBUTES = {
          email: Type.string,
          nickname: Type.string,
          first_name: Type.string,
          last_name: Type.string,
          kind: Type.string,
          name: Type.string,
          password: Type.string,
          password_confirmation: Type.string,
          remove_avatar: Type.boolean,
          avatar: Type.attachment_styles,
          created_at: Type.date_time,
          role: Type.string,
          updated_at: Type.date_time,
          full_name: Type.string,
          avatar_styles: Type.attachment_styles,
          abilities: Type.abilities,
          is_current_user: Type.boolean,
          class_abilities: Type.object, # TODO: Flesh out class abilities
          persistent_ui: Type.object(parameters: {
                                       reader: Type.object(parameters: {
                                                             colors: Type.object,
                                                             typography: Type.object,
                                                             reading_groups: Type.object
                                                           })
                                     }),
          notification_preferences_by_kind: Type.array(
            items: Type.object(parameters: {
                                 type: Type.object(parameters: {
                                                     digest: Type.string,
                                                     projects: Type.string,
                                                     replies_to_me: Type.string,
                                                     followed_project: Type.string,
                                                     flagged_resources: Type.string,
                                                     digest_comments_and_annotations: Type.string,
                                                     project_comments_and_annotations: Type.string
                                                   })
                               })
          )
        }.freeze

        RELATIONSHIPS = {
          makers: Type.collection(contains: "makers")
        }.freeze

        class << self

          include Resource

        end
      end
    end
  end
end
