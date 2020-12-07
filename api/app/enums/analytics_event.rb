class AnalyticsEvent < ClassyEnum::Base
  class << self
    def build(name)
      enum = find(name)
      enum.is_a?(AnalyticsEvent) ? enum : AnalyticsEvent::Other.new(name)
    end
  end

  def interaction
    Analytics::RecordEvent
  end

  def analytics_params
    nil
  end
end

class AnalyticsEvent::View < AnalyticsEvent
  def interaction
    Analytics::RecordViewEvent
  end
end

class AnalyticsEvent::Leave < AnalyticsEvent
  def interaction
    Analytics::RecordLeaveEvent
  end
end

class AnalyticsEvent::Search < AnalyticsEvent
  def interaction
    Analytics::RecordSearchEvent
  end

  def analytics_params
    [:keyword]
  end
end

class AnalyticsEvent::Other < AnalyticsEvent
  def initialize(name = "other")
    @name = name
  end

  def to_s
    @name.to_s
  end
end
