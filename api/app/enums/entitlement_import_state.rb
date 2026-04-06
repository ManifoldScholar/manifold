# frozen_string_literal: true

class EntitlementImportState < ClassyEnum::Base
end

class EntitlementImportState::Pending < EntitlementImportState
end

class EntitlementImportState::Success < EntitlementImportState
end

class EntitlementImportState::Failure < EntitlementImportState
end
