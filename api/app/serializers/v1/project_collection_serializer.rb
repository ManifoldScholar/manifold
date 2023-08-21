module V1
  class ProjectCollectionSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :title, Types::String.meta(unique: true)
    typed_attribute :slug, Types::String.meta(description: I18n.t("attributes.descriptions.slug"), read_only: true)
    typed_attribute :pending_slug, Types::String.meta(description: I18n.t("attributes.descriptions.pending_slug"))
    typed_attribute :sort_order, Types::String.enum(
      "created_at_asc",
      "created_at_desc",
      "updated_at_asc",
      "updated_at_desc",
      "publication_date_asc",
      "publication_date_desc",
      "title_asc",
      "title_desc"
    )
    typed_attribute :visible, Types::Bool
    typed_attribute :homepage, Types::Bool
    typed_attribute :position, Types::Integer
    typed_attribute :icon, Types::String.enum("lamp")
    typed_attribute :number_of_projects, Types::Integer.optional
    typed_attribute :featured_only, Types::Bool
    typed_attribute :smart, Types::Bool
    typed_attribute :description, Types::String.optional
    typed_attribute :description_formatted, Types::String.meta(read_only: true)
    typed_attribute :description_plaintext, Types::String.meta(read_only: true)
    typed_attribute :short_description, Types::String.optional
    typed_attribute :short_description_formatted, Types::String.meta(read_only: true)
    typed_attribute :short_description_plaintext, Types::String.meta(read_only: true)
    typed_attribute :tag_list, Types::Array.of(Types::String) # check value
    typed_attribute :homepage_start_date, Types::String.optional
    typed_attribute :homepage_end_date, Types::String.optional
    typed_attribute :homepage_count, Types::Integer.optional
    typed_attribute :manually_sorted, Types::Bool.meta(read_only: true), &:manually_sorted?
    typed_attribute :projects_count, Types::Integer.meta(read_only: true), &:collection_projects_count
    typed_attribute :hero_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :hero_alt_text, Types::String.optional
    typed_attribute :custom_icon_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :hero_layout, Types::String.enum("square_inset", "wide_inset", "full_bleed")
    typed_attribute :social_description, Types::String.optional
    typed_attribute :social_title, Types::String.optional
    typed_attribute :social_image_styles, Types::Serializer::Attachment.meta(read_only: true)

    typed_has_many :collection_projects do |object, params|
      object.collection_projects.projects_with_read_ability(params[:current_user]).eager_load(:project_summary)
    end

    when_full do
      typed_has_many :subjects, serializer: SubjectSerializer
    end

  end
end
