class Ahoy::Store < Ahoy::DatabaseStore
  def visit_model
    Analytics::Visit
  end

  def event_model
    Analytics::Event
  end

end

Ahoy.api = true
Ahoy.job_queue = :low_priority

# GDPR Compliance
Ahoy.cookies = false
Ahoy.mask_ips = true

Ahoy.logger = Logger.new(STDOUT)
