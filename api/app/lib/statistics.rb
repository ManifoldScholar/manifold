require "google/apis/analytics_v3"
require "google/api_client/auth/key_utils"

class Statistics
  extend ActiveModel::Naming
  include ActiveModel::Validations
  include ActiveModel::Conversion
  include Authority::Abilities
  include SerializedAbilitiesFor
  include Redis::Objects

  lock :transaction, timeout: 1, expiration: 15
  value :this_week, marshal: true
  value :last_week, marshal: true

  def id
    0
  end

  # @!attribute [rw] readers_this_week
  # @return [Float]
  def readers_this_week
    this_week.value.to_f
  end

  def readers_this_week=(new_value)
    this_week.value = new_value.to_f
  end

  # @!attribute [rw] readers_last_week
  # @return [Float]
  def readers_last_week
    last_week.value.to_f
  end

  def readers_last_week=(new_value)
    last_week.value = new_value
  end

  # Update values in a redis lock.
  #
  # @yieldparam [Statistics] instance the instance itself to update
  # @yieldreturn [void]
  # @return [void]
  def update
    transaction_lock.lock do
      yield self if block_given?
    end
  end

  # @return [Integer]
  def reader_increase
    if readers_last_week.zero?
      readers_this_week.positive? ? percentify(readers_this_week) : 0
    else
      diff = readers_this_week - readers_last_week

      diff.zero? ? 0 : percentify(diff / readers_last_week)
    end
  end

  def new_highlights_count
    Annotation.only_annotations.in_the_week_of(Date.current).count
  end

  def new_annotations_count
    Annotation.only_highlights.in_the_week_of(Date.current).count
  end

  def new_comments_count
    Comment.in_the_week_of(Date.current).count
  end

  def new_texts_count
    Text.in_the_week_of(Date.current).count
  end

  def total_project_count
    Project.count
  end

  def total_text_count
    Text.count
  end

  def total_resource_count
    Resource.count
  end

  def total_annotation_count
    Annotation.count
  end

  def total_comment_count
    Comment.count
  end

  def total_user_count
    User.count
  end

  private

  # @param [Numeric] value
  # @return [Integer]
  def percentify(value)
    (value * 100).to_i
  end

  class << self
    # @yieldparam [Statistics] statistics
    # @yieldreturn [void]
    # @return [void]
    def update!
      return unless block_given?

      instance = new

      instance.update do
        yield instance
      end
    end

  end
end
