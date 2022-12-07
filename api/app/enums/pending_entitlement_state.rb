# frozen_string_literal: true

class PendingEntitlementState < ClassyEnum::Base
end

class PendingEntitlementState::Pending < PendingEntitlementState
end

class PendingEntitlementState::Success < PendingEntitlementState
end

class PendingEntitlementState::Failure < PendingEntitlementState
end
