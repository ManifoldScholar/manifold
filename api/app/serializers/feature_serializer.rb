# Provides a serialization of a page model.
class FeatureSerializer < ApplicationSerializer
  meta(partial: false)

  attributes :id, :header, :header_formatted, :subheader, :subheader_formatted,
             :body, :body_formatted, :link_text, :link_url, :link_target, :style, :hidden,
             :background_color, :foreground_color, :header_color, :layout, :created_at,
             :updated_at, :foreground_top, :foreground_left, :foreground_styles,
             :background_styles, :foreground_position, :position, :abilities, :live
end
