module Updaters
  module Concerns
    module HasSortableCollaborators
      extend ActiveSupport::Concern

      included do
        set_callback :save, :after, :sort_collaborators
      end

      def sort_collaborators
        collaborators = relationships.dig :collaborators, :data

        return unless collaborators.present?

        @model.collaborators.each_with_index do |collaborator, _i|
          index = collaborators.find_index { |c| c[:id] == collaborator.id }
          position = index + 1
          collaborator.set_list_position(position)
        end
      end
    end
  end
end
