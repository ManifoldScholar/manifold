module API
  module V1
    module Me
      module Relationships
        class CollectionsController < AbstractController
          resourceful! UserCollection do
            UserCollection.where(user: current_user)
          end

          def show
            @collection = load_and_authorize_user_collection

            render_single_resource @collection
          end

          def user_collection_id_from_params
            current_user&.id&.+"-collection"
          end
        end
      end
    end
  end
end
