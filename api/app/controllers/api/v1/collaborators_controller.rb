module API
  module V1
    class CollaboratorsController < ApplicationController

      resourceful! Collaborator, authorize_options: { except: [:roles] } do
        Collaborator.filtered(collaborator_filter_params)
      end

      def create
        @collaborators = collaborators_from_list(collaborator_list_params)
        render_multiple_resources(@collaborators, serializer: ::V1::CollaboratorSerializer)
      end

      def roles
        role_list = CollaboratorRole.map { |r| r.to_s }

        render json: { data: role_list }
      end

      private

      def collaborators_from_list(params)
        params[:data].each_with_object([]) do |c, arr|
          @collaborator = ::Updaters::Collaborator.new({ data: c }).update(Collaborator.new)
          @collaborator.save
          arr << @collaborator
        end
      end

    end
  end
end
