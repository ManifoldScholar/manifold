# frozen_string_literal: true

module Collections
  module Operations
    module CollectableOption
      extend ActiveSupport::Concern

      include MonadicJSONAPIErrors

      included do
        option :collectable, Types.Instance(Collectable)
        option :grouping, Types.Instance(CollectionGrouping).optional, optional: true
        option :position, Types::Coercible::Integer.optional, optional: true
      end

      def handle_upsert_for!(entry_collection)
        attributes = build_attributes

        entry = entry_collection.upsert! attributes

        reposition! entry if position.present?

        Dry::Monads.Success entry
      rescue ActiveRecord::RecordInvalid => e
        operation_error title: "Failed Upsert", detail: e.message, code: :invalid_entry
      end

      def has_position?
        position.present?
      end

      private

      def entry_collection_scope
        collector_definition.lookup.collectable_definition(collectable).fmap do |collectable_definition|
          collectable_definition.entry_collection_scope_for collector
        end
      end

      def reposition!(entry)
        return unless position.present?

        entry.position = position

        entry.save!
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
  end
end
