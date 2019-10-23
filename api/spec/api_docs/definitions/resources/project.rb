module ApiDocs
  module Definitions
    module Resources
      class Project

        READ_ONLY = [
          :avatar_styles,
          :hero_styles,
          :cover_styles,
          :created_at,
          :updated_at,
          :recently_updated,
          :image_credits_formatted,
          :events_count,
          :resource_collections_count,
          :avatar_meta,
          :subtitle_formatted,
          :subtitle_plaintext,
          :title_formatted,
          :title_plaintext,
          :resource_kinds,
          :creator_names,
          :updated,
          :abilities,
          :purchase_price_money,
          :purchase_price,
          :description_formatted,
          :resources_count,
          :citations,
          :resource_tags,
          :event_count,
          :resource_count,
          :event_types,
          :metadata_formatted,
          :metadata_properties,
          :slug
        ].freeze

        REQUEST_ATTRIBUTES = {
          avatar: ::Types::Serializer::Upload,
          hero: ::Types::Serializer::Upload,
          cover: ::Types::Serializer::Upload,
        }.freeze

        REQUIRED_CREATE_ATTRIBUTES = [:title].freeze

        class << self

          include Resource

        end
      end
    end
  end
end
