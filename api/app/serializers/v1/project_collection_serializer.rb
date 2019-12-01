module V1
  class ProjectCollectionSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::WithAbilities
    # include HasManyPaginated

    make_partial_by_default

    attributes :title,
               :slug,
               :pending_slug,
               :sort_order,
               :visible,
               :homepage,
               :position,
               :icon,
               :number_of_projects,
               :featured_only,
               :smart,
               :description,
               :description_formatted,
               :description_plaintext,
               :sort_order,
               :tag_list,
               :description,
               :homepage_start_date,
               :homepage_end_date,
               :homepage_count
    attributes :manually_sorted, &:manually_sorted?
    attributes :projects_count, &:collection_projects_count

    has_many_paginated :collection_projects do |object, params|
      object.collection_projects.projects_with_read_ability(params[:current_user])
    end

    full_has_many :subjects, serializer: SubjectSerializer
    # full_has_many :projects

    # has_many_paginated :collection_projects,
    #                    serializer: CollectionProjectSerializer do |serializer|
    #   serializer.object
    #     .collection_projects
    #     .projects_with_read_ability serializer.current_user
    # end

  end
end
