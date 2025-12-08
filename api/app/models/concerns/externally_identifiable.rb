# frozen_string_literal: true

module ExternallyIdentifiable
  extend ActiveSupport::Concern

  included do
    has_one :external_identifier, as: :identifiable, dependent: :destroy

    scope :by_external_identifier, ->(*identifiers) { joins(:external_identifier).where(external_identifiers: { identifier: identifiers }) }
  end

  def external_identifier=(record_or_identifier)
    case record_or_identifier.presence
    when ExternalIdentifier
      super(record_or_identifier)
    when String
      self.external_identifier.update(identifier: record_or_identifier)
    when nil
      self.external_identifier.destroy
    else
      raise ArgumentError, "Invalid external identifier value"
    end
  end
end
