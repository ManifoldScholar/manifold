require "google/apis/analytics_v3"
require "google/api_client/auth/key_utils"

class Statistics
  include ActiveModel::Validations
  include ActiveModel::Conversion
  include Authority::Abilities
  extend ActiveModel::Naming

  def id
    0
  end

  def initialize(_range = nil)
    @client = Factory::AnalyticsSession.new.create_analytics_session
    @range ||= Time.zone.today.at_beginning_of_week..Time.zone.today.at_end_of_week
    @settings = Settings.instance.general
  end

  def start_date
    @range.first
  end

  def end_date
    @range.last
  end

  def readers_this_week
    get_reader_count(start_date, end_date)
  end

  def readers_last_week
    get_reader_count(start_date - 7.days, end_date - 7.days)
  end

  def reader_increase
    this_week = readers_this_week
    last_week = readers_last_week
    return nil unless this_week && last_week

    if last_week.zero?
      result = this_week.positive? ? (this_week * 100).to_i : 0
    else
      diff = this_week - last_week
      result = diff.zero? ? 0 : ((diff / last_week) * 100).to_i
    end
    result
  end

  def new_highlights_count
    Annotation.where("created_at >= ? AND created_at <= ? AND format = ?",
                     start_date,
                     end_date,
                     "highlight")
              .count
  end

  def new_annotations_count
    Annotation.where("created_at >= ? AND created_at <= ? AND format = ?",
                     start_date,
                     end_date,
                     "annotation")
              .count
  end

  # def new_comments_count
  #   Annotation.where("created_at >= ? AND created_at <= ? AND format = ?",
  #                    start_date,
  #                    end_date,
  #                    "comment")
  #             .count
  # end

  def new_texts_count
    Text.where("created_at >= ? AND created_at <= ?",
               start_date,
               end_date)
        .count
  end

  def read_attribute_for_serialization(n)
    send(n)
  end

  protected

  def get_reader_count(start_date, end_date)
    return nil unless @client
    begin
      @client.get_ga_data(
        @settings["ga_profile_id"], # analytics profile ID
        start_date.to_s, # query start date
        end_date.to_s, # query end date
        "ga:pageviews", # metric
        dimensions: "ga:pagePath",
        filters: "ga:pagePath=@read;ga:pagePath!@section"
      ).totals_for_all_results["ga:pageviews"].to_f
    rescue Google::Apis::ClientError => e
      Rails.logger.error("Google API Client Error: #{e}")
      nil
    end
  end

end
