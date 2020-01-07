module ExportStrategies
  module Operations
    # Set up a {ExportStrategies::TargetNameFormatter target name formatter} for
    # further use within the pipeline.
    #
    # @see ExportStrategies::Pipelines::FormatTargetName
    class PrepareFormatter
      include Shared::PipelineOperation

      # @param [ExportStrategies::TargetNameFormatter, ProjectExport] project_export
      # @return [ExportStrategies::TargetNameFormatter]
      def call(input)
        case input
        when ExportStrategies::TargetNameFormatter then input
        when ProjectExport then input.to_target_name_formatter
        else
          # :nocov:
          Failure([:invalid_input, "#{input.inspect} is not formattable"])
          # :nocov:
        end
      end
    end
  end
end
