module ExportStrategies
  # A tuple of {ProjectExport} and {ExportTarget} that represents a selection to upload.
  #
  # @see ProjectExportation#to_selection
  class Selection
    extend Dry::Initializer

    include Sliceable

    param :exportation, Types.Instance(ProjectExportation)
    param :export, Types.Instance(ProjectExport)
    param :target, Types.Instance(ExportTarget)

    delegate :configuration, :strategy, to: :target
    delegate :project, to: :export
    delegate :target_name_format, to: :configuration

    # @return [{ Symbol => Object }]
    def to_upload_state
      slice(:configuration, :export, :exportation, :target, :target_name_format).merge(selection: self)
    end
  end
end
