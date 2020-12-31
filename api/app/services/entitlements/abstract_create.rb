module Entitlements
  # @abstract
  class AbstractCreate < ActiveInteraction::Base
    isolatable!

    transactional!

    CHRONIC_OPTIONS = {
      # When in doubt, dates should always be considered in the future
      context: :future,
      # We prefer MM/DD/YYYY dates if provided something ambiguous.
      # In general, people should use YYYY/MM/DD.
      endian_precedence: :middle
    }.freeze

    record :target_url, class: "GlobalID", finder: :new

    string :expiration, default: nil

    hash :global_roles, default: proc { {} } do
      boolean :subscriber, default: false
    end

    hash :scoped_roles, default: proc { {} } do
      boolean :read_access, default: false
    end

    validate :find_target!
    validate :find_expires_on!

    # @abstract
    # @return [Entitlement]
    def execute
      # :nocov:
      raise NotImplementedError
      # :nocov:
    end

    attr_reader :entitlement, :expires_on, :target

    private

    def assign_attributes_to(entitlement)
      entitlement.assign_attributes inputs.slice(:global_roles, :scoped_roles)
      entitlement.expires_on = expires_on
      entitlement.target = target
    end

    # @return [void]
    def find_expires_on!
      return if expiration.blank?

      parsed_date = Chronic.parse(expiration, CHRONIC_OPTIONS.deep_dup.merge(now: Time.current)).try(:to_date)

      if parsed_date.blank?
        errors.add :expiration, "did not produce a valid date"
      elsif parsed_date <= Date.current
        errors.add :expiration, "must be in the future"
      else
        @expires_on = parsed_date
      end
    end

    # @return [void]
    def find_target!
      @target = target_url.find
    rescue ActiveRecord::RecordNotFound => e
      errors.add :target_url, e.message
    else
      errors.add :target_url, "does not correspond to a known target" if @target.blank?
      errors.add :target_url, "cannot receive entitlements" unless @target.is_a?(ReceivesEntitlements)
    end
  end
end
