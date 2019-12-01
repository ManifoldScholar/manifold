module V1
  class ResourceCollectionSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::WithAbilities

    attributes :title,
               :title_formatted,
               :created_at,
               :description,
               :description_formatted,
               :project_id,
               :resource_kinds,
               :resource_tags,
               :collection_resources_count,
               :slug,
               :pending_slug

    camelized_attributes :thumbnail_styles

    attributes :resource_tags do |object, _params|
      object.resource_tags.sort
    end

    has_many :resources
    belongs_to :project

  end
end
