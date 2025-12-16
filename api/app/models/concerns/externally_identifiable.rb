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
      super
    when String
      if external_identifier.present?
        external_identifier.update(identifier: record_or_identifier)
      else
        build_external_identifier(identifier: record_or_identifier)
      end
    when nil
      external_identifier&.destroy
    else
      raise ArgumentError, "Invalid external identifier value"
    end
  end
end
