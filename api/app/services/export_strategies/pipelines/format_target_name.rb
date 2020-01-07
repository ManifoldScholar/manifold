module ExportStrategies
  module Pipelines
    # Pipeline that takes a {ProjectExport} and turns it into a formatted target name.
    #
    # @see ExportStrategies::TargetNameFormatter
    class FormatTargetName
      include Dry::Transaction(container: ExportStrategies::Container, step_adapters: ::Shared::StepAdapters)

      auto_step :prepare_formatter, with: "operations.prepare_formatter"
      auto_step :apply_format, with: "operations.apply_format"
      auto_step :clean_up_dots, with: "operations.clean_up_dots"
      auto_step :sanitize, with: "operations.sanitize"
    end
  end
end
