# frozen_string_literal: true

module ManifoldOAI
  class SetLinker
    RecordOrSource = Types::RecordSource | Types.Instance(::ManifoldOAIRecord)

    RecordsOrSources = Types::Coercible::Array.of(RecordOrSource)

    include Dry::Monads[:result]
    include Dry::Initializer[undefined: false].define -> do
      param :set, Types.Instance(::ManifoldOAISet)

      param :records_or_sources, RecordsOrSources
    end

    delegate :id, to: :set, prefix: :manifold_oai_set

    # @return [Dry::Monads::Result(void)]
    def call
      prepare!

      collect_tuples!

      upsert!

      Success()
    end

    private

    # @return [void]
    def prepare!
      @tuples = []
    end

    # @return [void]
    def collect_tuples!
      records_or_sources.each do |record_or_source|
        case record_or_source
        in Types::RecordSource => source
          collect_tuple_from!(source.manifold_oai_record)
        in ManifoldOAIRecord => record
          collect_tuple_from!(record)
        end
      end

      @tuples.uniq!
    end

    # @param [ManifoldOAIRecord] record
    # @return [void]
    def collect_tuple_from!(record)
      return if record.blank?

      manifold_oai_record_id = record.id

      @tuples << { manifold_oai_set_id:, manifold_oai_record_id:, }
    end

    def upsert!
      # :nocov:
      return if @tuples.blank?
      # :nocov:

      ManifoldOAISetLink.upsert_all(@tuples, unique_by: %i[manifold_oai_set_id manifold_oai_record_id])
    end
  end
end
