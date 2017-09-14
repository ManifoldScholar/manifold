# Provides a serialization of a page model.
class FeatureSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :id, :background_styles, :foreground_styles, :header, :header_formatted,
             :subheader, :subheader_formatted, :body, :body_formatted, :link_text,
             :link_url, :link_target, :foreground_position, :position, :created_at,
             :updated_at, :style, :foreground_top_padding
end
