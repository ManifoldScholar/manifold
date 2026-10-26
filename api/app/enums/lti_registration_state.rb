# frozen_string_literal: true

class LtiRegistrationState < ClassyEnum::Base
end

class LtiRegistrationState::Pending < LtiRegistrationState
end

class LtiRegistrationState::Approved < LtiRegistrationState
end

class LtiRegistrationState::Denied < LtiRegistrationState
end

class LtiRegistrationState::Blocked < LtiRegistrationState
end
