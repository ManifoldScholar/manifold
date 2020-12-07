class AnalyticsEventType < ClassyEnum::Base
  class << self
    def build(name)
      enum = find(name)
      enum.is_a?(AnalyticsEventType) ? enum : AnalyticsEventType::Other.new(name)
    end
  end

  def interaction
    Analytics::RecordEvent
  end

  def analytics_params
    nil
  end
end

class AnalyticsEventType::View < AnalyticsEventType
  def interaction
    Analytics::RecordViewEvent
  end
end

class AnalyticsEventType::CreateResource < AnalyticsEventType
  def interaction
    Analytics::RecordCreateEvent
  end
end

class AnalyticsEventType::Leave < AnalyticsEventType
  def interaction
    Analytics::RecordLeaveEvent
  end
end

class AnalyticsEventType::Search < AnalyticsEventType
  def interaction
    Analytics::RecordSearchEvent
  end

  def analytics_params
    [:keyword]
  end
end

class AnalyticsEventType::Other < AnalyticsEventType
  def initialize(name = "other")
    @name = name
  end

  def to_s
    @name.to_s
  end
end
