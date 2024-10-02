# frozen_string_literal: true

module TimestampScopes
  extend ActiveSupport::Concern

  included do
    scope :by_recently_created, -> { order(created_at: :desc) }
    scope :by_recently_updated, -> { order(updated_at: :desc) }

    scope :in_recent_order, -> { by_recently_created }

    scope :created_more_than, ->(time) { where(arel_table[:created_at].lteq(time)) }
    scope :updated_more_than, ->(time) { where(arel_table[:updated_at].lteq(time)) }

    scope :created_since, ->(time) { where(arel_table[:created_at].gteq(time)) }
    scope :updated_since, ->(time) { where(arel_table[:updated_at].gteq(time)) }

    scope :created_in_the_last, ->(duration) { created_since(duration.ago) }
    scope :updated_in_the_last, ->(duration) { updated_since(duration.ago) }
  end

  module ClassMethods
    # @return [ApplicationRecord, nil]
    def latest
      in_recent_order.first
    end
  end
end
