module Updaters
  module Concerns
    module HasSortableCollaborators
      extend ActiveSupport::Concern

      COLLABORATOR_KINDS = %w(contributor creator).freeze

      included do
        set_callback :save, :after, :sort_relationships
      end

      def sort_relationships
        COLLABORATOR_KINDS.each do |kind|
          sort_collaborators kind if @model.respond_to? "#{kind}_collaborators".to_sym
        end
      end

      def sort_collaborators(kind)
        makers = relationships.to_h.dig "#{kind}s", :data
        return unless makers && !makers.empty?

        @model.__send__("#{kind}_collaborators").each do |collaborator|
          index = makers.find_index { |c| c[:id] == collaborator.maker_id }
          position = index + 1
          collaborator.set_list_position(position)
        end
      end
    end
  end
end
