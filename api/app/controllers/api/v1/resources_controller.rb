module Api
  module V1
    # resources controller
    class ResourcesController < ApplicationController

      authorize_actions_for Resource, except: [:index, :show]
      before_action :set_resource, only: [:show, :update, :destroy]

      # GET /resources
      def index
        @resources = Resource
                     .filtered(resource_filter_params[:filter])
                     .page(page_number)
                     .per(page_size)
        render json: @resources,
               each_serializer: ResourceSerializer,
               meta: { pagination: pagination_dict(@resources) }
      end

      # GET /resource/1
      def show
        render json: @resource
      end

      # POST /resources
      def create
        @resource = resource.new(resource_params)
        if @resource.save
          render json: @resource, status: :created, location: [:api, :v1, @resource]
        else
          render json: @resource.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /resources/1
      def update
        if @resource.update(resource_params)
          render json: @resource
        else
          render json: @resource.errors, status: :unprocessable_entity
        end
      end

      # DELETE /resources/1
      def destroy
        @resource.destroy
      end

      private

      # Use callbacks to share common setup or constraints between actions.
      def set_resource
        @resource = Resource.find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def resource_params
        params.require(:resource).permit
      end
    end
  end
end
