module Api
  module V1
    # Collections controller
    class CollectionsController < ApplicationController

      INCLUDES = [:project, :resources].freeze

      resourceful! Collection, authorize_options: { except: [:index, :show] } do
        Collection.filter(with_pagination!(collection_filter_params))
      end

      # GET /collections
      def index
        @collections = load_collections
        render_multiple_resources(
          @collections,
          each_serializer: CollectionSerializer
        )
      end

      # GET /collections/1
      def show
        @collection = load_collection
        render_single_resource(@collection, include: INCLUDES)
      end

      # POST /collections
      def create
        @collection = authorize_and_create_collection(collection_params)
        render_single_resource @collection
      end

      # PATCH/PUT /collections/1
      def update
        @collection = load_and_authorize_collection
        ::Updaters::Collection.new(collection_params).update(@collection)
        render_single_resource(@collection, include: INCLUDES)
      end

      # DELETE /projects/1
      def destroy
        @collection = load_and_authorize_collection
        @collection.destroy
      end

      private

      def scope_for_collections
        Collection.friendly
      end

    end
  end
end
