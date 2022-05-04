# frozen_string_literal: true

module Collections
  module Operations
    class Clone
      extend Dry::Initializer

      include Dry::Core::Memoizable
      include Dry::Effects::Handler.Resolve
      include Dry::Effects::Handler.State(:grouping_map)
      include Dry::Monads::Do.for(:call)
      include Dry::Monads::Do.for(:clone_collectables!)
      include Dry::Monads[:result]
      include MonadicPersistence
      include ManifoldApi::Deps[
        clone_collectable: "collections.clone_collectable",
        clone_groupings: "collections.clone_groupings",
      ]

      param :source, Types::Collector
      param :target, Types::Collector

      SHARED_DELEGATES = %i[has_grouping? reorderable?].freeze

      delegate *SHARED_DELEGATES, to: :source_mapping, prefix: :source
      delegate *SHARED_DELEGATES, to: :target_mapping, prefix: :target

      # When cloning collectors that have groupings, this will be used to store
      # a mapping of `source_grouping_id` => `target_grouping_id`.
      # @return [{ String => String }]
      memoize def grouping_map
        {}
      end

      memoize def provisions
        {
          clone_groupings: has_grouping?,
          clone_position: reorderable?,
          grouping_map: grouping_map,
          source: source,
          source_mapping: source_mapping,
          target: target,
          target_mapping: target_mapping,
        }
      end

      memoize def source_mapping
        Collections::Mapping[source]
      end

      memoize def target_mapping
        Collections::Mapping[target]
      end

      def call
        with_provisions do
          yield maybe_clone_groupings!

          yield clone_collectables!
        end

        Success()
      end

      def has_grouping?
        source_has_grouping? && target_has_grouping?
      end

      def reorderable?
        source_reorderable? && target_reorderable?
      end

      private

      # @return [Dry::Monads::Result]
      def clone_collectables!
        source_mapping.collectables.each do |source_collectable_mapping|
          with_collectable_provisions_for(source_collectable_mapping) do |source_entries|
            source.public_send(source_entries).find_each do |source_entry|
              yield clone_collectable.(source_entry)
            end
          end
        end

        Success()
      end

      # @see Collections::CloneGroupings
      # @return [Dry::Monads::Result]
      def maybe_clone_groupings!
        return Success() unless has_grouping?

        clone_groupings.()
      end

      # @return [void]
      def with_provisions
        provide provisions do
          yield
        end
      end

      # @param [Collections::CollectableDefinition] source_collectable_mapping
      def with_collectable_provisions_for(source_collectable_mapping)
        scm = source_collectable_mapping

        provs = {
          source_collectable_mapping: scm,
        }

        tcm = provs[:target_collectable_mapping] = target_mapping[scm.collectable.name]

        provs.merge!(prefixed_collectable_provisions(scm, :source))
        provs.merge!(prefixed_collectable_provisions(tcm, :target))

        provide provs do
          yield provs[:source_entries]
        end
      end

      def prefixed_collectable_provisions(mapping, prefix)
        {}.tap do |x|
          x[:entries] = mapping.associations.entry.collection
          x[:collectable_id] = mapping.associations.collectable.foreign_key
          x[:grouping_id] = has_grouping? ? mapping.associations.grouping.foreign_key : nil
        end.transform_keys do |key|
          :"#{prefix}_#{key}"
        end
      end
    end
  end
end
