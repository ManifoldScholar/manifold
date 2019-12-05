module V1
  class FeatureSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :id, NilClass
    typed_attribute :header, NilClass
    typed_attribute :header_formatted, NilClass
    typed_attribute :subheader, NilClass
    typed_attribute :subheader_formatted, NilClass
    typed_attribute :body, NilClass
    typed_attribute :body_formatted, NilClass
    typed_attribute :link_text, NilClass
    typed_attribute :link_url, NilClass
    typed_attribute :link_target, NilClass
    typed_attribute :style, NilClass
    typed_attribute :hidden, NilClass
    typed_attribute :background_color, NilClass
    typed_attribute :foreground_color, NilClass
    typed_attribute :header_color, NilClass
    typed_attribute :layout, NilClass
    typed_attribute :created_at, NilClass
    typed_attribute :updated_at, NilClass
    typed_attribute :foreground_top, NilClass
    typed_attribute :foreground_left, NilClass
    typed_attribute :foreground_position, NilClass
    typed_attribute :position, NilClass
    typed_attribute :live, NilClass
    typed_attribute :include_sign_up, NilClass
    typed_attribute :foreground_styles, Hash
    typed_attribute :background_styles, Hash

  end
end
