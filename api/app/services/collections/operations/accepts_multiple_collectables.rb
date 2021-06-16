module Collections
  module Operations
    module AcceptsMultipleCollectables
      extend ActiveSupport::Concern

      include Collections::Operations::LoadsCollection
      include Dry::Effects::Handler.Reader(:operation_data_index)
      include Dry::Effects::Handler.Resolve
      include Dry::Monads[:list, :result, :validated, :do]

      private

      def map_collectables
        results = provide(collector: collector, collector_definition: collector_definition) do
          collectables.map.with_index do |collectable, index|
            with_operation_data_index(index) do
              yield collectable
            end
          end
        end

        List.coerce(results).typed(Dry::Monads::Result).traverse.to_result
      end
    end
  end
end
