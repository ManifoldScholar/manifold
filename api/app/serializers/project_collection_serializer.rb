class ProjectCollectionSerializer < ApplicationSerializer
  meta(partial: false)

  attributes :id, :title, :slug, :sort_order, :visible, :homepage, :position, :icon,
             :number_of_projects, :featured_only, :smart, :description,
             :description_formatted, :tags, :sort_column, :sort_direction,
             :project_count, :abilities

  has_many :projects, serializer: ProjectPartialSerializer

end
