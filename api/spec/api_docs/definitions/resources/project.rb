module ApiDocs
  module Definitions
    module Resources
      class Project

        READ_ONLY = [
          :avatar_styles, :hero_styles, :cover_styles, :created_at, :updated_at, :recently_updated,
          :image_credits_formatted, :events_count, :resource_collections_count, :avatar_meta,
          :subtitle_formatted, :title_formatted, :title_plaintext, :resource_kinds, :abilities,
          :resource_tags, :image_credits_formatted, :event_count, :resource_collections_count,
          :resource_count, :event_types, :metadata_formatted, :metadata_properties, :slug
        ].freeze

        WRITE_ONLY = [
          :pending_slug, :avatar, :hero, :cover
        ].freeze

        ATTRIBUTES = {
          pending_slug: ::Types::String,
          avatar: ::Types::Serializer::Upload,
          hero: ::Types::Serializer::Upload,
          cover: ::Types::Serializer::Upload,
        }.freeze

        class << self

          include Resource

        end
      end
    end
  end
end
