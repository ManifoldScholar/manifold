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
    REDIS.with do |conn|
      conn.hget("cache:statistics", :this_week).to_f
    end
  end

  def readers_last_week
    REDIS.with do |conn|
      conn.hget("cache:statistics", :last_week).to_f
    end
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
                     "highlight").count
  end

  def new_annotations_count
    Annotation.where("created_at >= ? AND created_at <= ? AND format = ?",
                     start_date,
                     end_date,
                     "annotation").count
  end

  def new_comments_count
    Comment.where("created_at >= ? AND created_at <= ?",
                  start_date,
                  end_date).count
  end

  def new_texts_count
    Text.where("created_at >= ? AND created_at <= ?",
               start_date,
               end_date).count
  end

  def read_attribute_for_serialization(n)
    send(n)
  end

end
