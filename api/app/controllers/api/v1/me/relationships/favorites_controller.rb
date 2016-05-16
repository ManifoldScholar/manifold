module Api
  module V1
    module Me
      module Relationships
        # Favorites controller
        class FavoritesController < ApplicationController
          before_action :authenticate_request!
          before_action :set_favorite, only: [:show, :update, :destroy]

          # Returns all favorites for a user
          def index
            render json: @current_user.favorites,
                   include: %w(favoritable),
                   each_serializer: FavoriteSerializer
          end

          # Create a new favorite for the current user
          def create
            attributes = polymorphic_relationship_from(favorite_params, "favoritable")
            @favorite = @current_user.favorites.create(attributes)
            if @favorite.save
              render json: @favorite,
                     status: :created,
                     location: [:api, :v1, :me, :relationships, @favorite]
            else
              render json: @favorite.errors, status: :unprocessable_entity
            end
          end

          def show
            render json: @favorite,
                   include: %w(favoritable)
          end

          # Destroy a favorite by ID
          def destroy
          end

          private

          def set_favorite
            @favorite = @current_user.favorites.find(params[:id])
          end
        end
      end
    end
  end
end
