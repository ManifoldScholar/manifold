module APIDocs
  module Definitions
    module Resources
      class Resource

        REQUEST_ATTRIBUTES = {
          attachment: Types::Serializer::Upload,
          remove_attachment: Types::Bool,

          high_res: Types::Serializer::Upload,
          remove_high_res: Types::Bool,

          variant_format_one: Types::Serializer::Upload,
          remove_variant_format_one: Types::Bool,

          variant_format_two: Types::Serializer::Upload,
          remove_variant_format_two: Types::Bool,

          variant_thumbnail: Types::Serializer::Upload,
          remove_variant_thumbnail: Types::Bool,

          variant_poster: Types::Serializer::Upload,
          remove_variant_poster: Types::Bool
        }

        METADATA_ATTRIBUTES = {
          series_title: Types::String,
          container_title: Types::String,
          isbn: Types::String,
          issn: Types::String,
          doi: Types::String,
          original_publisher: Types::String,
          original_publisher_place: Types::String,
          original_title: Types::String,
          publisher: Types::String,
          publisher_place: Types::String,
          version: Types::String,
          series_number: Types::String,
          edition: Types::String,
          issue: Types::String,
          volume: Types::String,
          rights: Types::String,
          rights_territory: Types::String,
          restrictions: Types::String,
          rights_holder: Types::String,
          creator: Types::String,
          alt_text: Types::String,
          credit: Types::String,
          copyright_status: Types::String,
        }

        class << self
          include ::APIDocs::Definitions::Resource
        end
      end
    end
  end
end
