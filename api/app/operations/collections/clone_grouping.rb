# frozen_string_literal: true

module Collections
  class CloneGrouping
    include Dry::Effects.State(:grouping_map)
    include Dry::Effects.Resolve(:source)
    include Dry::Effects.Resolve(:source_mapping)
    include Dry::Effects.Resolve(:target)
    include Dry::Effects.Resolve(:target_mapping)
    include Dry::Monads::Do.for(:call)
    include Dry::Monads[:result]
    include MonadicPersistence

    delegate :grouping_name, to: :source_mapping, prefix: :source
    delegate :grouping_name, to: :target_mapping, prefix: :target

    # @param [CollectionGrouping] source_grouping
    # @return [Dry::Monads::Result]
    def call(source_grouping)
      target_grouping = yield clone source_grouping

      grouping_map[source_grouping.id] = target_grouping.id

      Success()
    end

    private

    # @param [CollectionGrouping] source_grouping
    # @return [Dry::Monads::Result(CollectionGrouping)]
    def clone(source_grouping)
      case [source_grouping_name, target_grouping_name]
      when %w[ReadingGroupCategory ReadingGroupCategory]
        clone_reading_group_category(source_grouping)
      else
        # :nocov:
        Failure[:unable_to_clone_grouping, source_grouping_name, target_grouping_name]
        # :nocov:
      end
    end

    # @param [ReadingGroupCategory] source_grouping
    # @return [Dry::Monads::Result(ReadingGroupCategory)]
    def clone_reading_group_category(source_grouping)
      attrs = source_grouping.slice(:title, :slug, :position, :description)

      attrs[:reading_group] = target

      target_grouping = ReadingGroupCategory.new attrs

      monadic_save target_grouping
    end
  end
end
