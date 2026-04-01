# frozen_string_literal: true

require "auth_token"
require "resolv"

module ManifoldEnv
  class RateLimiting
    include DefinesRateLimits

    DNS_SERVERS = %w[
      8.8.8.8
      8.8.4.4
    ].freeze

    PUBLIC_IPS_CACHE_KEY = "rate_limiting:public_ips"

    map_throttle! :comment_creation, limit: 10, period: 3600

    map_throttle! :public_annotation_creation, limit: 5, period: 300

    map_throttle! :public_reading_group_creation, limit: 10, period: 3600

    map_throttle! :registration, limit: 5, period: 86_400

    def id
      1
    end

    def each_throttled_category
      self.class.throttle_mapping.each do |category, options|
        throttler = Throttler.new(category, options: options)

        yield throttler
      end
    end

    # @return [Set<String>]
    def public_ips
      Rails.cache.read(PUBLIC_IPS_CACHE_KEY) || Set.new
    rescue ActiveRecord::StatementInvalid
      Set.new
    end

    # @param [String] domain
    # @return [void]
    def derive_public_ips!(domain)
      Resolv::DNS.open nameserver: DNS_SERVERS do |dns|
        resp = dns.getresources domain, Resolv::DNS::Resource::IN::A

        reset_public_ips! resp.map { |h| h.address.to_s }
      end
    rescue Resolv::ResolvError
      # :nocov:
      clear_public_ips!
      # :nocov:
    end

    private

    # @param [<String>] new_ips
    # @return [void]
    def reset_public_ips!(new_ips)
      if new_ips.present?
        Rails.cache.write(PUBLIC_IPS_CACHE_KEY, new_ips.to_set)
      else
        clear_public_ips!
      end
    end

    # @return [void]
    def clear_public_ips!
      Rails.cache.delete(PUBLIC_IPS_CACHE_KEY)
    end

    # @api private
    class Throttler
      include Dry::Core::Equalizer.new(:category)

      include Dry::Initializer[undefined: false].define -> do
        param :category, Types::ThrottledCategory

        option :options, Types::ThrottleOptions

        option :email_key, Types::String, default: proc { "#{category}:email" }
        option :ip_key, Types::String, default: proc { "#{category}:ip" }
      end
    end
  end
end
