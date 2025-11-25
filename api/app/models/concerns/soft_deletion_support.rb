# frozen_string_literal: true

# Support methods for detecting if soft-deletion is happening.
# Models do not have to be soft-deletable to take advantage of this concern.
module SoftDeletionSupport
  extend ActiveSupport::Concern

  # @see SoftDeletions::Current
  def soft_deleting?
    SoftDeletions::Current.active?
  end
end
