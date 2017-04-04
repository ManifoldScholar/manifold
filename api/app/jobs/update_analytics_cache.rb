# Simple job to create a new event in the background.
class UpdateAnalyticsCache < ApplicationJob
  queue_as :default

  # rubocop:disable Metrics/AbcSize
  def perform
    client, settings, range = setup
    this_week = count_readers(client, settings, range.first, range.last)
    last_week = count_readers(client, settings, range.first - 7.days, range.last - 7.days)
    cache(this_week, last_week)
  rescue Faraday::ConnectionFailed
    Rails.logger.error("Connection Failed: unable to update Google Analytics cache.")
  end
  # rubocop:enableMetrics/AbcSize

  def setup
    client = Factory::AnalyticsSession.new.create_analytics_session
    settings = Settings.instance.general
    range ||= Time.zone.today.at_beginning_of_week..Time.zone.today.at_end_of_week
    [client, settings, range]
  end

  def cache(this_week, last_week)
    REDIS.with do |conn|
      key = "cache:statistics"
      conn.hset key, :this_week, this_week
      conn.hset key, :last_week, last_week
    end
  end

  def count_readers(client, settings, start_date, end_date)
    count = client.get_ga_data(
      settings["ga_profile_id"],
      start_date.to_s,
      end_date.to_s,
      "ga:pageviews",
      dimensions: "ga:pagePath",
      filters: "ga:pagePath=@read;ga:pagePath!@section"
    ).totals_for_all_results["ga:pageviews"].to_f
    return count
  rescue Google::Apis::ClientError => e
    Rails.logger.error("Google API Client Error: #{e}")
    nil
  end

end
