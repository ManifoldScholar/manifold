module Collections
  module Operations
    # rubocop:disable Metrics/AbcSize
    module CollectableOption
      extend ActiveSupport::Concern

      include MonadicJSONAPIErrors

      included do
        option :collectable, Types.Instance(Collectable)
        option :grouping, Types.Instance(CollectionGrouping).optional, optional: true
        option :position, Types::Coercible::Integer.optional, optional: true
      end

      private

      def entry_collection_scope
        collector_definition.lookup.collectable_definition(collectable).fmap do |collectable_definition|
          collectable_definition.entry_collection_scope_for collector
        end
      end

      def build_attributes
        {
          collectable.model_name.singular => collectable
        }.tap do |attributes|
          if collector_definition.has_grouping?
            grouping_name = collector_definition.grouping.model_name.singular

            attributes[grouping_name] = grouping
          end

          attributes[:position] = position if position.present?
        end
      end
    end
    # rubocop:enable Metrics/AbcSize
  end
end
