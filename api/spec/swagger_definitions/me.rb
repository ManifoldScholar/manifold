require_relative 'base_types'
require_relative 'favorites'

module Me
  class << self
    ##############################
    ##   PARAMS & ATTRIBUTES    ##
    ##############################

    def notification_preference_attributes
      {
        flaggedResources: Type.string( example: 'never' ),
        projectCommentsAndAnnotations: Type.string( example: 'never' ),
        repliesToMe: Type.string( example: 'never' ),
        digest: Type.string( example: 'never' ),
        projects: Type.string( example: 'never' ),
        followedProjects: Type.string( example: 'never' ),
        digestCommentsAndAnnotations: Type.string( example: 'never' )
      }
    end

    def persistentUI_attributes
      {
        reader: Type.object({
          colors: Type.object({}), #TODO define the contents of this object
          typography: Type.object({}), #TODO define the contents of this object
          readingGroups: Type.object({}) #TODO define the contents of this object
        })
      }
    end

    def class_abilities_attributes
      Type.attributes_with_crud([
        'actionCallout',
        'category',
        'collaborator',
        'collectionProject',
        'collectionResource',
        'contentBlock',
        'event',
        'favorite',
        'feature',
        'flag',
        'ingestionSource',
        'maker',
        'ingestion',
        'page',
        'projectCollectionSubject',
        'projectCollection',
        'projectSubject',
        'readingGroupMembership',
        'resourceCollection',
        'resource',
        'stylesheet',
        'subject',
        'resourceImport',
        'tag',
        'textSubject',
        'textTitle',
        'twitterQuery',
        'version',
        'user',
        'annotation',
        'textSection',
        'statistics'
      ]).merge({
        comment: Type.object(
          Type.crud({ readDeleted: Type.boolean })
        ),
        settings: Type.object(
          Type.crud({ readSecrets: Type.boolean })
        ),
        text: Type.object(
          Type.crud({ notate: Type.boolean })
        ),
        project: Type.object(
          Type.crud({
            readDrafts: Type.boolean,
            readLog: Type.boolean,
            manageResources: Type.boolean,
            createResources: Type.boolean,
            manageResourceCollections: Type.boolean,
            createResourceCollections: Type.boolean,
            managePermissions: Type.boolean,
            createPermissions: Type.boolean,
            manageTexts: Type.boolean,
            createTexts: Type.boolean,
            manageTwitterQueries: Type.boolean,
            createTwitterQueries: Type.boolean,
            manageEvents: Type.boolean,
            manageSocials: Type.boolean,
            updateMakers: Type.boolean
          })
        )
      })
    end

    def get_model_attributes
      {
        email:          Type.email,
        nickname:       Type.string,
        firstName:      Type.string,
        lastName:       Type.string,
        kind:           Type.string,
        createdAt:      Type.date_time,
        role:           Type.string,
        updatedAt:      Type.date_time,
        fullName:       Type.string,
        avatarSyles:    Type.image,
        abilities:      Type.object( Type.crud ),
        isCurrentUser:  Type.boolean,
        persistentU:    Type.object( persistentUI_attributes ),
        classAbilities: Type.object( class_abilities_attributes ),
        notificationPreferences: Type.object( notification_preference_attributes )
      }
    end

    def included
      Type.response_with_relationships(
        Favorites.get_model_attributes,
        { favoritable: Type.relationship_data_attribute }
      )
    end

    def model_response
      Type.response( get_model_attributes )
    end

    ##############################
    ##  CRUD OPERATION SCHEMAS  ##
    ##############################

    def request_update
      Type.request(
        Type.object({
          email: Type.email,
          nickname: Type.string,
          firstName: Type.string,
          lastName: Type.string,
          name: Type.string,
          pendingRole: Type.string,
          removeAvatar: Type.boolean,
          avatar: Type.attachment,
          notificationPreferences: Type.object( notification_preference_attributes )
          # unsubscribe #TODO check if this is valid and what the type is
          # persistentUi #TODO check what this is
        })
      )
    end

    def response
      Type.object({
        data: Type.object({
          id: Type.id,
          type: Type.string,
          attributes: Type.object( get_model_attributes ),
          relationships: Type.object({
            favorites: Type.relationship_data
          }),
          meta: Type.meta_partial
        }),
        included: Type.array({ type: included })
      })
    end

    def get_model
      response
    end
  end
end
