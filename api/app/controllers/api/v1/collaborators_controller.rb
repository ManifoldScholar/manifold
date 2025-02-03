module API
  module V1
    class CollaboratorsController < ApplicationController

      def roles
        role_list = CollaboratorRole.map { |r| r.to_s }

        render json: { data: role_list }
      end
    end
  end
end
