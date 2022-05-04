# frozen_string_literal: true

module Collections
  class CloneGroupings
    include Dry::Effects::Handler.State(:grouping_map)
    include Dry::Effects.Resolve(:grouping_map)
    include Dry::Effects.Resolve(:source)
    include Dry::Monads[:do, :result]
    include ManifoldApi::Deps[clone_grouping: "collections.clone_grouping"]

    # @return [Dry::Monads::Result]
    def call
      with_grouping_map(grouping_map) do
        grouping_scope.find_each do |source_grouping|
          yield clone_grouping.(source_grouping)
        end
      end

      Success()
    end

    private

    def grouping_scope
      case source
      when ::ReadingGroup
        source.reading_group_categories
      else
        source.class.none
      end
    end
  end
end
