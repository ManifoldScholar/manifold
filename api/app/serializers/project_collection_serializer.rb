class ProjectCollectionSerializer < ApplicationSerializer
  include HasManyPaginated

  meta(partial: true)

  attributes :id, :title, :slug, :sort_order, :visible, :homepage, :position, :icon,
             :number_of_projects, :featured_only, :smart, :description,
             :description_formatted, :description_plaintext, :sort_order,
             :manually_sorted, :projects_count, :abilities, :tag_list, :description,
             :homepage_start_date, :homepage_end_date, :homepage_count

  has_many_paginated :collection_projects,
                     serializer: CollectionProjectSerializer do |serializer|
    serializer.object
              .collection_projects
              .projects_with_read_ability serializer.current_user
  end

  def page_params(association_name)
    return [1, object.homepage_count] if
      instance_options[:paginate_for_homepage] && association_name == :collection_projects

    per = pagination.dig(association_name, :size)
    page = pagination.dig(association_name, :number) || 1
    [page, per]
  end

  def manually_sorted
    object.manually_sorted?
  end

  def projects_count
    object.collection_projects_count
  end

end
