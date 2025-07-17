# frozen_string_literal: true

module ManifoldOAI
  class RecordWrapper < OAI::Provider::ActiveRecordWrapper
    attr_reader :model

    def initialize
      super(ManifoldOAIRecord)
    end

    def deleted?(record)
      record.deleted_at
    end
  end
end
