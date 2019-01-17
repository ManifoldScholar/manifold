class ProjectCollectionSerializer < ApplicationSerializer
  include HasManyPaginated

  meta(partial: true)

  attributes :id, :title, :slug, :sort_order, :visible, :homepage, :position, :icon,
             :number_of_projects, :featured_only, :smart, :description,
             :description_formatted, :description_plaintext, :sort_order,
             :manually_sorted, :projects_count, :abilities, :tag_list, :description,
             :homepage_start_date, :homepage_end_date

  has_many_paginated :collection_projects,
                     serializer: CollectionProjectSerializer do |serializer|
    serializer.object
              .collection_projects
              .with_collection_order
              .projects_with_read_ability serializer.current_user
  end

  def manually_sorted
    object.manually_sorted?
  end

  def projects_count
    object.collection_projects_count
  end

end
