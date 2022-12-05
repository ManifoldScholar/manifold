class EntitlementImportRowState < ClassyEnum::Base
end

class EntitlementImportRowState::Pending < EntitlementImportRowState
end

class EntitlementImportRowState::Success < EntitlementImportRowState
end

class EntitlementImportRowState::Failure < EntitlementImportRowState
end
