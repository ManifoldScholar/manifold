module Api
  module V1
    class ProjectCollectionsController < ApplicationController

      INCLUDES = %w(collection_projects subjects collection_projects.project
                    collection_projects.project.creators
                    collection_projects.project.contributors).freeze

      resourceful! ProjectCollection, authorize_options: { except: [:index, :show] } do
        ProjectCollection.filter(with_pagination!(project_collection_filter_params),
                                 scope: ProjectCollection.all)
      end

      # GET /project-collections
      def index
        @project_collections = load_project_collections
        render_multiple_resources @project_collections,
                                  paginate_for_homepage: filtering_for_home_page,
                                  pagination: params[:page],
                                  include: INCLUDES
      end

      # GET /project-collections/1
      def show
        @project_collection = load_project_collection
        render_single_resource @project_collection,
                               serializer: ProjectCollectionFullSerializer,
                               pagination: params[:page],
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
                               pagination: params[:page],
                               include: INCLUDES
      end

      # DELETE /projects-collection/1
      def destroy
        @project_collection = load_and_authorize_project_collection
        @project_collection.destroy
      end

      protected

      def filtering_for_home_page
        return false unless project_collection_filter_params
        Utilities::Truthy.truthy? project_collection_filter_params[:visible_on_homepage]
      end

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
