require_relative 'base_types'

module Me
  class << self
    def attributes_with_crud(array)
      hash = Hash.new
      array.each { |attribute|
        hash["#{attribute}"] = Type.object( Type.crud )
      }
      return hash
    end

    def request_update
      Type.submit_wrapper(Type.object({
        email: Type.email,
        nickname: Type.string,
        firstName: Type.string,
        lastName: Type.string,
        name: Type.string,
        pendingRole: Type.string,
        removeAvatar: Type.boolean,
        avatar: Type.attachment,
        notificationPreferences: Type.object({
          flaggedResources: Type.string( example: 'never' ),
          projectCommentsAndAnnotations: Type.string( example: 'never' ),
          repliesToMe: Type.string( example: 'never' ),
          digest: Type.string( example: 'never' ),
          projects: Type.string( example: 'never' ),
          followedProjects: Type.string( example: 'never' ),
          digestCommentsAndAnnotations: Type.string( example: 'never' )
        })
        # unsubscribe #TODO check if this is valid and what the type is
        # persistentUi #TODO check what this is
      }))
    end

    def response
      Type.object({
        data: Type.object({
          id: Type.id,
          type: Type.string,
          attributes: Type.object({
            email: Type.email,
            nickname: Type.string,
            firstName: Type.string,
            lastName: Type.string,
            kind: Type.string,
            createdAt: Type.date_time,
            role: Type.string,
            updatedAt: Type.date_time,
            fullName: Type.string,
            avatarSyles: Type.image,
            abilities: Type.object( Type.crud ),
            isCurrentUser: Type.boolean,
            persistentU: Type.object({
              reader: Type.object({
                colors: Type.object({}), #TODO define the contents of this object
                typography: Type.object({}), #TODO define the contents of this object
                readingGroups: Type.object({}) #TODO define the contents of this object
              })
            }),
            classAbilities: Type.object(
              attributes_with_crud([
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
              }),
            ),
            notificationPreferences: Type.object({
              flaggedResources: Type.string( example: 'never' ),
              projectCommentsAndAnnotations: Type.string( example: 'never' ),
              repliesToMe: Type.string( example: 'never' ),
              digest: Type.string( example: 'never' ),
              projects: Type.string( example: 'never' ),
              followedProjects: Type.string( example: 'never' ),
              digestCommentsAndAnnotations: Type.string( example: 'never' )
            })
          }),
          relationships: Type.object({
            favorites: Type.relationship_data
          }),
          meta: Type.meta_partial
        })
      })
    end
  end
end
