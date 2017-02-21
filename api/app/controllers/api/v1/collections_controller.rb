module Api
  module V1
    # Collections controller
    class CollectionsController < ApplicationController

      authorize_actions_for Collection, except: [:index, :show]
      before_action :set_collection, only: [:show, :update, :destroy]

      # GET /collections
      def index
        @collections = Collection.filtered(collection_filter_params)
        render json: @collections,
               each_serializer: CollectionSerializer
      end

      # GET /collections/1
      def show
        render json: @collection,
               include: %w(resources)
      end

      # POST /collections
      def create
        @collection = Collection.new(collection_params)
        if @collection.save
          render json: @collection, status: :created, location: [:api, :v1, @collection]
        else
          render json: @collection.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /collections/1
      def update
        if @collection.update(collection_params)
          render json: @collection
        else
          render json: @collection.errors, status: :unprocessable_entity
        end
      end

      # DELETE /projects/1
      def destroy
        @collection.destroy
      end

      private

      def set_collection
        @collection = Collection.includes(:resources).find(params[:id])
      end

      # Only allow a trusted parameter "white list" through.
      def collection_params
        params.require(:collection)
      end
    end
  end
end
