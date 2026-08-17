# frozen_string_literal: true

module Lti
  # The allow/block decision for LTI issuers, normalized to hostname.
  # The blocklist wins over the allowlist, and an empty allowlist permits any host that is not blocked.
  class IssuerPolicy
    # @param lti_settings [SettingSections::Lti]
    def initialize(lti_settings = Settings.current.lti)
      @lti_settings = lti_settings
    end

    # @param issuer [String] an issuer URL or bare hostname
    # @return [Boolean]
    def permits?(issuer)
      host = self.class.normalize_host(issuer)
      return false if host.blank?

      allowed?(host) && !blocked?(host)
    end

    # @param value [String, nil]
    # @return [String, nil]
    def self.normalize_host(value)
      return nil if value.blank?

      host = URI.parse(value).host || value
      host.delete_prefix("www.").downcase
    rescue URI::InvalidURIError
      value.split("/").first.to_s.delete_prefix("www.").downcase.presence
    end

    private

    attr_reader :lti_settings

    # @param host [String]
    # @return [Boolean]
    def allowed?(host)
      allowlist = normalized(lti_settings.issuer_allowlist)

      allowlist.blank? || allowlist.include?(host)
    end

    # @param host [String]
    # @return [Boolean]
    def blocked?(host)
      normalized(lti_settings.issuer_blocklist).include?(host)
    end

    # @param entries [Array<String>]
    # @return [Array<String>]
    def normalized(entries)
      Array(entries).filter_map { |entry| self.class.normalize_host(entry) }
    end
  end
end
