require_relative 'base_types'

module Users
  class << self
    def request_create
      Type.request({
        type: :object,
        properties: {
          firstName: Type.string,
          lastName: Type.string,
          nickname: Type.string,
          name: Type.string,
          email: Type.email,
          password: Type.string,
          passwordConfirmation: Type.string,
          removeAvatar: Type.boolean,
          avatar: Type.attachment,
          persistent_ui: Type.object({
            reader: Type.object({
              colors: Type.object({}, { description: "TKTKTK"}), # TODO add description or fill out attributes
              typography: Type.object({}, { description: "TKTKTK"}), # TODO add description or fill out attributes
              reading_groups: Type.object({}, { description: "TKTKTK"}) # TODO add description or fill out attributes
            })
          }),
          notification_preferences_by_kind: Type.array({
            type: Type.object({
              digest: Type.string( nullable: true ), # TODO check types
              replies_to_me: Type.string( nullable: true ), # TODO check types
              project_comments_and_annotations: Type.string( nullable: true ), # TODO check types
              flagged_resources: Type.string( nullable: true ), # TODO check types
              digest_comments_and_annotations: Type.string( nullable: true ), # TODO check types
              projects: Type.string( nullable: true ), # TODO check types
              followed_project: Type.string( nullable: true ), # TODO check types
            })
          }),
          unsubscribe: Type.boolean,
        },
        required: [ 'name', 'email', 'password', 'password_confirmation'],
      })
    end

    def response
      Type.response({
        email: Type.email(nullable: true),
        nickname: Type.string,
        firstName: Type.string,
        lastName: Type.string,
        kind: Type.string(nullable: true),
        createdAt: Type.date_time(nullable: true),
        role: Type.string(nullable: true),
        updatedAt: Type.date_time,
        fullName: Type.string,
        avatarStyles: Type.image,
        abilities: Type.object( Type.crud ),
        isCurrentUser: Type.boolean
      })
    end
  end
end
