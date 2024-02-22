# frozen_string_literal: true

module DetectsSpam
  extend ActiveSupport::Concern

  # Check to see if this record has any attributes that
  # get detected as spam.
  #
  # @see SpamValidator
  def spam_detected?
    return false if valid?

    errors.any? { |err| err.type == :spam }
  end

  alias has_spam_detected? spam_detected?

  module ClassMethods
    # @note This transforms a scope into an array, since we need to run
    #   each model through the {SpamValidator}. This can be a little slow,
    #   and care should be taken to make sure it won't run into issues with
    #   exceeding any rate limits on the spam detection providers.
    # @return [<DetectsSpam>]
    def detected_as_spam
      all.select(&:spam_detected?)
    end
  end
end
