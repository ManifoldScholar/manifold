module ApiDocs
  module Definitions
    module Resources
      class Project

        # TODO: Accepts metadata(Project)

        REQUEST_ATTRIBUTES = {
          avatar: Types::Serializer::Upload,
          hero: Types::Serializer::Upload,
          cover: Types::Serializer::Upload,
          remove_avatar: Types::Bool,
          remove_hero: Types::Bool,
          remove_cover: Types::Bool,
        }.freeze

        REQUIRED_CREATE_ATTRIBUTES = [:title].freeze

        class << self

          include Resource

          def create_attributes
            request_attributes.except(
              :remove_avatar,
              :remove_hero,
              :remove_cover
            )
          end

        end
      end
    end
  end
end
