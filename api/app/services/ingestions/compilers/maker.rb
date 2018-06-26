module Ingestions
  module Compilers
    class Maker < AbstractInteraction
      object :text
      hash :manifest, strip: false
      hash :attributes do
        string :name
      end

      def execute
        update_or_create
      end

      private

      def maker
        @maker ||= initialize_maker
      end

      def collaborator
        @collaborator ||= initialize_collaborator
      end

      def initialize_maker
        ::Maker.find_or_create_by ::Maker.parse_name(attributes[:name])
      end

      def initialize_collaborator
        ::Collaborator.find_or_initialize_by maker: maker
      end

      def update_or_create
        collaborator.update collaborator_attributes
      end

      def collaborator_attributes
        {
          collaboratable: text,
          role: Collaborator::ROLE_CREATOR
        }
      end
    end
  end
end
