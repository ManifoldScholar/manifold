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
Ahoy.job_queue = :low_priority

# GDPR Compliance
Ahoy.cookies = false
Ahoy.mask_ips = true
