module V1
  class FeatureSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::WithAbilities

    attributes :id,
               :header,
               :header_formatted,
               :subheader,
               :subheader_formatted,
               :body,
               :body_formatted,
               :link_text,
               :link_url,
               :link_target,
               :style,
               :hidden,
               :background_color,
               :foreground_color,
               :header_color,
               :layout,
               :created_at,
               :updated_at,
               :foreground_top,
               :foreground_left,
               :foreground_position,
               :position,
               :live,
               :include_sign_up

    camelized_attributes :foreground_styles
    camelized_attributes :background_styles

  end
end
