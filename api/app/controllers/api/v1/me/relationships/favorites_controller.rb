module Api
  module V1
    module Me
      module Relationships
        # Favorites Controller
        class FavoritesController < ApplicationController

          before_action :authenticate_request!

          resourceful! Favorite do
            current_user.favorites
          end

          def index
            @favorites = load_favorites
            render_multiple_resources(
              @favorites,
              location: location
            )
          end

          def create
            updater = ::Updaters::Default.new(favorite_params)
            @favorite = updater.update(current_user.favorites.build)
            # The response here is fairly non-standard and unexpected. We should likely
            # refactor this at some point.
            if @favorite.valid?
              render_authenticated_user(current_user, include_token: false, status: :created)
            else
              render_single_resource(@favorite, location: location)
            end
          end

          def show
            @favorite = load_and_authorize_favorite
            render_single_resource(@favorite, location: location)
          end

          def destroy
            @favorite = load_and_authorize_favorite
            @favorite.destroy
          end

          private

          def location
            [:api, :v1, :me]
          end

        end
      end
    end
  end
end
