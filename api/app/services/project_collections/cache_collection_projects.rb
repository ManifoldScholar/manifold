module ProjectCollections
  class CacheCollectionProjects < ActiveInteraction::Base
    record :project_collection

    delegate :featured_only?, to: :project_collection
    delegate :tags, to: :project_collection
    delegate :subjects, to: :project_collection
    delegate :number_of_projects, to: :project_collection
    delegate :projects, to: :project_collection
    delegate :collection_projects, to: :project_collection
    delegate :project_sorting, to: :project_collection

    validate :must_be_smart!

    def execute
      valid_projects = query.limit(number_of_projects).order(project_sorting)

      return project_collection if valid_projects.pluck(:id) == projects.pluck(:id)

      collection_projects.where.not(project_id: valid_projects.pluck(:id)).destroy_all

      create_collection_projects valid_projects

      project_collection.reload
    end

    private

    def must_be_smart!
      return if project_collection.smart?

      errors.add :project_collection, "must be a smart collection"
    end

    def create_collection_projects(projects)
      projects.each_with_index do |project, position|
        cp = collection_projects.find_or_initialize_by project: project
        cp.update position: position
      end
    end

    def query
      base_scope = build_base_scope
      conditions = build_conditions

      return base_scope if conditions.blank?

      filter_scope = conditions.inject(Project.none) do |current_scope, next_scope|
        current_scope.or next_scope
      end

      base_scope.merge filter_scope
    end

    def build_base_scope
      featured_only? ? Project.by_featured(true) : Project.all
    end

    def build_conditions
      [].tap do |array|
        array << Project.by_tag(tags, true) if tags.exists?
        array << Project.by_subject(subjects) if subjects.exists?
      end
    end

  end
end
