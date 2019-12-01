module V1
  class PageSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::WithAbilities

    make_partial_by_default

    attributes :slug,
               :pending_slug,
               :title,
               :nav_title,
               :show_in_footer,
               :show_in_header,
               :created_at,
               :updated_at,
               :hidden,
               :body_formatted,
               :purpose,
               :is_external_link,
               :external_link,
               :open_in_new_tab

    full_attributes :body

  end
end
