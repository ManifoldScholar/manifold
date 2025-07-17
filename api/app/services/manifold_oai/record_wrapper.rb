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

    def earliest
      @model.minimum(:updated_at) || Time.zone.at(0)
    end

    def latest
      @model.maximum(:updated_at) || Time.current
    end
  end
end
