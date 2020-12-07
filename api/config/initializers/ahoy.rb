module Ahoy
  class Store < Ahoy::DatabaseStore
    def visit_model
      Analytics::Visit
    end

    def event_model
      Analytics::Event
    end

    # Disable linking visits to Users
    def authenticate(_data); end
  end
end

Ahoy.api = true
Ahoy.api_only = true
Ahoy.job_queue = :low_priority

# GDPR Compliance
Ahoy.cookies = false
Ahoy.mask_ips = true

# We have tests against analytics that need tracking to occur. Ahoy will see
# our tests as bots, which will cause it to exclude visits unless we tell it to
# tack bots.
Ahoy.track_bots = true if Rails.env.test?
