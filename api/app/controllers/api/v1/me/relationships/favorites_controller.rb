module Api
  module V1
    module Me
      module Relationships
        # Favorites Controller
        class FavoritesController < ApplicationController

          before_action :authenticate_request!

          INCLUDES = %w(favorites).freeze
          LOCATION = [:api, :v1, :me].freeze

          resourceful! Favorite do
            current_user.favorites
          end

          def index
            @favorites = load_favorites
            render_multiple_resources(
              @favorites,
              each_serializer: FavoriteSerializer,
              location: LOCATION
            )
          end

          def create
            updater = ::Updaters::Default.new(favorite_params)
            @favorite = updater.update(current_user.favorites.build)
            if @favorite.valid?
              render_single_resource(
                current_user,
                include: INCLUDES,
                location: LOCATION,
                serializer: CurrentUserSerializer
              )
            else
              render_single_resource(@favorite, location: LOCATION)
            end
          end

          def show
            @favorite = load_and_authorize_favorite
            render_single_resource(@favorite, include: INCLUDES, location: LOCATION)
          end

          def destroy
            @favorite = load_and_authorize_favorite
            @favorite.destroy
          end
        end
      end
    end
  end
end
