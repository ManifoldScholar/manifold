module V1
  class PageSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :slug, NilClass
    typed_attribute :pending_slug, NilClass
    typed_attribute :title, NilClass
    typed_attribute :nav_title, NilClass
    typed_attribute :show_in_footer, NilClass
    typed_attribute :show_in_header, NilClass
    typed_attribute :created_at, NilClass
    typed_attribute :updated_at, NilClass
    typed_attribute :hidden, NilClass
    typed_attribute :body_formatted, NilClass
    typed_attribute :purpose, NilClass
    typed_attribute :is_external_link, NilClass
    typed_attribute :external_link, NilClass
    typed_attribute :open_in_new_tab, NilClass

    when_full do
      typed_attribute :body, NilClass
    end

  end
end
