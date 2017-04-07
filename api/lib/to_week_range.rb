module ToWeekRange
  include ActiveSupport::Concern

  # @return [Range<Date>]
  def to_week_range
    date = is_a?(Date) ? self : to_date

    date.beginning_of_week..date.end_of_week
  end
end

Date.include ToWeekRange
Time.include ToWeekRange
ActiveSupport::TimeWithZone.include ToWeekRange
