module Api
  module V1
    # Projects controller
    class ProjectsController < ApplicationController
      before_action :set_project, only: [:show, :update, :destroy]

      # GET /projects
      def index
        @projects = Project.filtered(filter_params)
        render json: @projects, include: ["creators", "collaborators"], each_serializer: ProjectPartialSerializer
      end

      # GET /projects/1
      def show
        render json: @project
      end

      # POST /projects
      def create
        @project = Project.new(project_params)
        if @project.save
          render json: @project, status: :created, location: [:api, :v1, @project]
        else
          render json: @project.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /projects/1
      def update
        if @project.update(project_params)
          render json: @project
        else
          render json: @project.errors, status: :unprocessable_entity
        end
      end

      # DELETE /projects/1
      def destroy
        @project.destroy
      end

      private

      # Use callbacks to share common setup or constraints between actions.
      def set_project
        @project = Project.find(params[:id])
      end

      def filter_params
        params.permit(filter: [:featured])
      end

      # Only allow a trusted parameter "white list" through.
      def project_params
        params.require(:project)
      end
    end
  end
end
