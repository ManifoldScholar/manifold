module ToWeekRange
  include ActiveSupport::Concern

  # @return [Range<Date>]
  def to_week_range
    date = is_a?(Date) ? self : to_date

    date.all_week
  end
end

Date.include ToWeekRange
Time.include ToWeekRange
ActiveSupport::TimeWithZone.include ToWeekRange
