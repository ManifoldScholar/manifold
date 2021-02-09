module Collections
  module Operations
    module LoadsCollection
      extend ActiveSupport::Concern

      def load_collection
        collector_definition.lookup.collection(collector.id).fmap do |collection|
          collection.reload

          collection
        end
      end
    end
  end
end
