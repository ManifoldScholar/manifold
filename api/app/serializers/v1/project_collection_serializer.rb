module V1
  class ProjectCollectionSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :title, NilClass
    typed_attribute :slug, NilClass
    typed_attribute :pending_slug, NilClass
    typed_attribute :sort_order, NilClass
    typed_attribute :visible, NilClass
    typed_attribute :homepage, NilClass
    typed_attribute :position, NilClass
    typed_attribute :icon, NilClass
    typed_attribute :number_of_projects, NilClass
    typed_attribute :featured_only, NilClass
    typed_attribute :smart, NilClass
    typed_attribute :description, NilClass
    typed_attribute :description_formatted, NilClass
    typed_attribute :description_plaintext, NilClass
    typed_attribute :sort_order, NilClass
    typed_attribute :tag_list, NilClass
    typed_attribute :description, NilClass
    typed_attribute :homepage_start_date, NilClass
    typed_attribute :homepage_end_date, NilClass
    typed_attribute :homepage_count, NilClass
    typed_attribute :manually_sorted, NilClass, &:manually_sorted?
    typed_attribute :projects_count, NilClass, &:collection_projects_count

    typed_has_many :collection_projects, paginated: true do |object, params|
      object.collection_projects.projects_with_read_ability(params[:current_user])
    end

    when_full do
      typed_has_many :subjects, serializer: SubjectSerializer
    end

  end
end
