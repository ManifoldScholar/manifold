# frozen_string_literal: true

# Check incoming content for spamminess based on external API determinations.
#
# This can be turned off with the {SettingSections::General general} setting `disable_spam_detection`.
#
# @see SpamMitigation::Check
# @see SpamMitigation::Checker
class SpamValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    # :nocov:
    return if value.blank? || Settings.current.general.disable_spam_detection?
    # :nocov:

    user = RequestStore[:current_user] || record.try(:creator)

    type = options[:type].presence || "comment"

    result = ManifoldApi::Container["spam_mitigation.check"].(value, type: type, user: user)

    is_spam = result.value_or(false)

    record.errors.add(attribute, :spam) if is_spam
  end
end
