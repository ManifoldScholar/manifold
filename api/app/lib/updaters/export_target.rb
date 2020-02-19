module Updaters
  # Updates an {ExportTarget} model from JSON-API style params
  class ExportTarget
    include ::Updaters

    def attachment_fields
      []
    end

    def adjusted_attributes
      attr = super()
      return attr unless attributes_include_strategy_configuration?(attr)

      merge_strategy_configuration!(attr)
      attr
    end

    private

    def attributes_include_strategy_configuration?(attr)
      strategy = attr["strategy"] || @model.strategy.to_s
      attr.key?("configuration") && attr["configuration"].key?(strategy)
    end

    def merge_strategy_configuration!(attr)
      strategy = attr["strategy"] || @model.strategy.to_s
      strategy_config = @model.configuration.attributes[strategy]
      base = strategy_config.attributes || {}
      updates = attr["configuration"][strategy]
      attr["configuration"][strategy] = base.merge(updates)
    end

  end
end
