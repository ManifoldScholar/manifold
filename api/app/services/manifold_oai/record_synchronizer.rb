# frozen_string_literal: true

module ManifoldOAI
  class RecordSynchronizer
    include Dry::Monads[:result]
    include Dry::Initializer[undefined: false].define -> do
      param :source, Types::Source
    end

    # @return [ManifoldOAIRecord]
    attr_reader :record

    # @return [Dry::Monads::Result(void)]
    def call
      prepare!

      assign_metadata!

      record.save!

      Success()
    end

    private

    # @return [void]
    def assign_metadata!
      @record.oai_dc_content = extract_oai_dc_from_source
    end

    def extract_oai_dc_from_source
      # To Be Implemented
    end

    # @return [void]
    def prepare!
      @record = ManifoldOAIRecord.where(source:).first_or_initialize
    end
  end
end
