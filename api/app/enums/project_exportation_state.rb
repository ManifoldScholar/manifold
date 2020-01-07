class ProjectExportationState < ClassyEnum::Base
end

class ProjectExportationState::Pending < ProjectExportationState
end

class ProjectExportationState::ExportReady < ProjectExportationState
end

class ProjectExportationState::Success < ProjectExportationState
end

class ProjectExportationState::Failure < ProjectExportationState
end
