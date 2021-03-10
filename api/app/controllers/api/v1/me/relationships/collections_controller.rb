module API
  module V1
    module Me
      module Relationships
        class CollectionsController < ApplicationController
          resourceful! UserCollection do
            UserCollection.where(user: current_user)
          end

          def show
            return {} unless current_user

            @collection = load_and_authorize_user_collection

            render_single_resource @collection
          end

          def user_collection_id_from_params
            current_user&.id
          end
        end
      end
    end
  end
end
