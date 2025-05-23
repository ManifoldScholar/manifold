# frozen_string_literal: true

module ExportStrategies
  module Pipelines
    # Pipeline that takes a {ProjectExport} and turns it into a formatted target name.
    #
    # @see ExportStrategies::TargetNameFormatter
    class FormatTargetName
      include Dry::Transaction(container: ExportStrategies::Container, step_adapters: ::Shared::StepAdapters)

      step :prepare_formatter, with: "operations.prepare_formatter"
      step :apply_format, with: "operations.apply_format"
      step :clean_up_dots, with: "operations.clean_up_dots"
      step :sanitize, with: "operations.sanitize"
    end
  end
end
