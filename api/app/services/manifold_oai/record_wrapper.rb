# frozen_string_literal: true

module ManifoldOAI
  class RecordWrapper < OAI::Provider::Model
    attr_reader :model

    def initialize
      super()

      @identifier_field = "id"
      @timestamp_field = "updated_at"

      @model = ManifoldOAIRecord
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

    # @param [String, :all] selector
    # @param [Hash] options
    def find(selector, options = {})
      constraints = constraints_for(options)

      constraints.find(selector)
    end

    def sets
      ManifoldOAISet.all
    end

    private

    # @param [Hash] options
    # @return [ManifoldOAI::RecordConstraints]
    def constraints_for(options = {})
      opts = options.symbolize_keys.merge(model:, identifier_field:, timestamp_field:, earliest:, latest:, limit:)

      ManifoldOAI::RecordConstraints.new(**opts)
    end
  end
end
