module V1
  class PageSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :slug, Types::String.meta(read_only: true)
    typed_attribute :pending_slug, Types::String
    typed_attribute :title, Types::String
    typed_attribute :nav_title, Types::String
    typed_attribute :show_in_footer, Types::Bool
    typed_attribute :show_in_header, Types::Bool
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :updated_at, Types::DateTime.meta(read_only: true)
    typed_attribute :hidden, Types::Bool
    typed_attribute :body_formatted, Types::String.meta(example: "<p>string</p>", read_only: true)
    typed_attribute :purpose, Types::String.enum("terms_and_conditions", "privacy_policy", "supplemental_content")
    typed_attribute :is_external_link, Types::Bool
    typed_attribute :external_link, Types::Serializer::URL.meta(description: "Required if is_external_link is true")
    typed_attribute :open_in_new_tab, Types::Bool

    when_full do
      typed_attribute :body, Types::String
    end

  end
end
