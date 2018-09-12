module Api
  module V1
    class ProjectCollectionsController < ApplicationController

      INCLUDES = %w(collection_projects subjects collection_projects.project
                    collection_projects.project.creators
                    collection_projects.project.contributors).freeze

      resourceful! ProjectCollection, authorize_options: { except: [:index, :show] } do
        includes = [
          :collection_projects,
          :subjects,
          collection_projects: [project: [:collaborators]]
        ]

        ProjectCollection.filter(with_pagination!(project_collection_filter_params),
                                 scope: ProjectCollection.all.includes(includes))
      end

      # GET /project-collections
      def index
        @project_collections = load_project_collections
        render_multiple_resources @project_collections, include: INCLUDES
      end

      # GET /project-collections/1
      def show
        @project_collection = load_project_collection
        render_single_resource @project_collection,
                               serializer: ProjectCollectionFullSerializer,
                               include: INCLUDES
      end

      # POST /project-collections
      def create
        @project_collection =
          authorize_and_create_project_collection(project_collection_params)
        render_single_resource @project_collection, include: INCLUDES
      end

      # PATCH/PUT /project-collections/1
      def update
        @project_collection = load_and_authorize_project_collection
        ::Updaters::Default.new(project_collection_params).update(@project_collection)
        render_single_resource @project_collection,
                               serializer: ProjectCollectionFullSerializer,
                               include: INCLUDES
      end

      # DELETE /projects-collection/1
      def destroy
        @project_collection = load_and_authorize_project_collection
        @project_collection.destroy
      end

      protected

      def scope_for_project_collections
        ProjectCollection.friendly.includes(
          [:subjects,
           :collection_projects,
           { collection_projects: [{ project: [:collaborators] }] }]
        )
      end
    end
  end
end
