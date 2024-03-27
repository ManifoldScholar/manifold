# frozen_string_literal: true

require "auth_token"
require "resolv"

module ManifoldEnv
  class RateLimiting
    include DefinesRateLimits
    include Redis::Objects

    DNS_SERVERS = %w[
      8.8.8.8
      8.8.4.4
    ].freeze

    map_throttle! :comment_creation, limit: 10, period: 3600

    map_throttle! :public_annotation_creation, limit: 5, period: 300

    map_throttle! :public_reading_group_creation, limit: 10, period: 3600

    map_throttle! :registration, limit: 5, period: 86_400

    # We store the public IP(s) for the Manifold application
    # so that the client does not accidentally get throttled.
    set :public_ips

    def id
      1
    end

    def each_throttled_category
      self.class.throttle_mapping.each do |category, options|
        throttler = Throttler.new(category, options: options)

        yield throttler
      end
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
      public_ips.clear
      # :nocov:
    end

    private

    # @param [<String>] new_ips
    # @return [void]
    def reset_public_ips!(new_ips)
      if new_ips.present?
        self.public_ips = new_ips
      else
        public_ips.clear
      end
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
