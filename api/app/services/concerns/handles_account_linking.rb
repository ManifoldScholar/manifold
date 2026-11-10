# frozen_string_literal: true

# Which providers force a new login to prove ownership of the pre-existing account its email matched
# before the identity is attached. LTI requires it; other providers opt in later.
module HandlesAccountLinking
  extend ActiveSupport::Concern

  def account_linking_required_for?(provider)
    provider == "lti"
  end
end
