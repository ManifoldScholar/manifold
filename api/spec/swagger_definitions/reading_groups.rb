require_relative 'base_types'

module ReadingGroups
  class << self

    def response_attributes
      {
        name: Type.string,
        privacy: Type.string,
        invitationCode: Type.string,
        notifyOnJoin: Type.boolean,
        membershipsCount: Type.integer,
        allAnnotationsCount: Type.integer,
        annotationsCount: Type.integer,
        highlightsCount: Type.integer,
        createdAt: Type.date_time,
        currentUserRole: Type.string,
        currentUserIsCreator: Type.boolean,
        creatorId: Type.id,
        invitationUrl: Type.url,
        abilities: Type.object( Type.crud ),
        texts: Type.array( type: Type.object({}) )
      }
    end

    def response_relationships_fields
      {
        texts: Type.relationship_data,
        readingGroupMemberships: Type.relationship_data
      }
    end

    def response_complete_info
      Type.response_with_relationships(
        self.response_attributes,
        self.response_relationships_fields
      )
    end

    def reading_group_membership
      Type.response_with_relationships(
        {
          annotationsCount: Type.integer,
          highlightsCount: Type.integer,
          anonymousLabel: Type.string,
          name: Type.string,
          isCreator: Type.boolean,
          isCurrentUser: Type.boolean
        },
        { user: Type.relationship_data }
      )
    end

    def users
      Type.response(
        {
          email: Type.email,
          nickname: Type.string,
          firstName: Type.string,
          lastName: Type.string,
          kind: Type.string,
          createdAt: Type.date_time,
          role: Type.string,
          updatedAt: Type.date_time,
          fullName: Type.string,
          avatarStyles: Type.image,
          abilities: Type.object( Type.crud ),
          isCurrentUser: Type.boolean
        }
      )
    end

    def included
      {}
      # returns array with two different data structures:
      # a reading group membership
      # a user
    end

    def update_and_create_params
      {
        name: Type.string,
        privacy: Type.enum([
          'public',
          'private',
          'anonymous'
        ]),
        invitationCode: Type.string,
        notifyOnJoin: Type.boolean,
      }
    end

    def update_request
      Type.request(
        Type.object(self.update_and_create_params)
      )
    end

    def update_response
      self.response_complete_info
    end

    def create_request
      self.update_request
    end

    def response
      Type.object({
        data: self.response_complete_info,
        included: self.included
      })
    end

    def responses
      Type.object({
        data: Type.array(
          type: self.response_complete_info
        )
      })
    end
  end
end
