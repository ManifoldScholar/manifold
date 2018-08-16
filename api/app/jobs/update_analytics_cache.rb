class UpdateAnalyticsCache < ApplicationJob
  queue_as :default

  # rubocop:disable Metrics/AbcSize
  def perform
    @client   = Factory::AnalyticsSession.new.create_analytics_session
    @settings = Settings.instance.integrations

    this_week = count_readers_for(Date.current)
    last_week = count_readers_for(Date.current - 7)

    Statistics.update! do |stats|
      stats.readers_this_week = this_week
      stats.readers_last_week = last_week
    end
  rescue Faraday::ConnectionFailed
    Rails.logger.error("Connection Failed: unable to update Google Analytics cache.")
  end
  # rubocop:enable Metrics/AbcSize

  def count_readers_for(base_date)
    return 0 unless @client
    start_date, end_date = week_bounds_for(base_date)

    query = @client.get_ga_data(
      @settings["ga_profile_id"],
      start_date,
      end_date,
      "ga:pageviews",
      dimensions: "ga:pagePath",
      filters: "ga:pagePath=@read;ga:pagePath!@section"
    )

    query.totals_for_all_results["ga:pageviews"].to_f
  rescue Google::Apis::ClientError => e
    Rails.logger.error("Google API Client Error: #{e}")
    nil
  end

  private

  def week_bounds_for(base_date)
    [base_date.beginning_of_week.to_s, base_date.end_of_week.to_s]
  end
end
