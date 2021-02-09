module API
  module V1
    module Me
      module Relationships
        class FavoritesController < ApplicationController
          include MonadicControllerActions

          before_action :authenticate_request!

          resourceful! Favorite do
            current_user.favorites
          end

          def index
            @favorites = load_favorites

            render_multiple_resources(@favorites, location: location)
          end

          def show
            @favorite = load_and_authorize_favorite

            render_single_resource(@favorite, location: location)
          end

          def create
            handle_monadic_operation! "legacy.add_favorite", user: current_user, params: params do |m|
              m.success do
                # The response here is fairly non-standard and unexpected. We should likely
                # refactor this at some point.
                render_authenticated_user(current_user, include_token: false, status: :created)
              end
            end
          end

          def destroy
            @favorite = load_and_authorize_favorite

            handle_monadic_operation! "legacy.unfavorite", favorite: @favorite do |m|
              m.success do
                head :no_content
              end
            end
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
