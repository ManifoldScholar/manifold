# frozen_string_literal: true

module ManifoldOAI
  class SetSynchronizer
    include Dry::Monads[:result]
    include Dry::Initializer[undefined: false].define -> do
      param :source, Types::SetSource
    end

    # @return [ManifoldOAISet]
    attr_reader :set

    # @return [Dry::Monads::Result(void)]
    def call
      prepare!

      assign_metadata!

      set.save!

      Success(set)
    end

    private

    # @return [void]
    def assign_metadata!
      set.spec = "#{source.set_category}:#{source.set_spec}"
      set.name = source.set_name
      set.description = source.set_description
    end

    # @return [void]
    def prepare!
      @set = ManifoldOAISet.where(source:).first_or_initialize
    end
  end
end
