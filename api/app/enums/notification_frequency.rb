class NotificationFrequency < ClassyEnum::Base
  include ActiveSupport::Configurable

  config.nondigest = false
  config.digest = false

  def digest?
    config.digest.present?
  end

  def nondigest?
    config.nondigest.present?
  end
end
class NotificationFrequency::Never < NotificationFrequency
  config.digest = true
  config.nondigest = true
end

class NotificationFrequency::Always < NotificationFrequency
  config.nondigest = true
end

class NotificationFrequency::Daily < NotificationFrequency
  config.digest = true
end

class NotificationFrequency::Weekly < NotificationFrequency
  config.digest = true
end
