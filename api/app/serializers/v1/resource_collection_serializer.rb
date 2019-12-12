module V1
  class ResourceCollectionSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :title, NilClass
    typed_attribute :title_formatted, NilClass
    typed_attribute :created_at, NilClass
    typed_attribute :description, NilClass
    typed_attribute :description_formatted, NilClass
    typed_attribute :project_id, NilClass
    typed_attribute :resource_kinds, NilClass
    typed_attribute :resource_tags, NilClass
    typed_attribute :collection_resources_count, NilClass
    typed_attribute :slug, NilClass
    typed_attribute :pending_slug, NilClass
    typed_attribute :thumbnail_styles, Types::Hash

    typed_attribute :resource_tags, NilClass do |object, _params|
      object.resource_tags.sort
    end

    typed_has_many :resources
    typed_belongs_to :project

  end
end
