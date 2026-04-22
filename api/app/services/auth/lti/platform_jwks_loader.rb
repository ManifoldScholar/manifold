# frozen_string_literal: true

module Auth
  module Lti
    # Returns a callable suitable for passing to `JWT.decode` as the `jwks:`
    # option. Backed by Rails.cache with a 24h TTL on the JWKS fetch itself
    # and a short per-registration debounce on kid-miss refetches so that a
    # forged/unknown kid cannot flood the platform's JWKS endpoint.
    #
    # jwt 2.10.2's JWT::JWK::KeyFinder invokes the callable with:
    #   - { kid: kid }                                      (first attempt)
    #   - { invalidate: true, kid_not_found: true, kid: k } (second attempt,
    #                                                        on kid miss)
    class PlatformJwksLoader
      CACHE_TTL    = 24.hours
      DEBOUNCE_TTL = 30.seconds

      def initialize(registration)
        @registration = registration
      end

      def to_proc
        ->(options) { load(options) }
      end

      private

      def load(options)
        if options[:invalidate]
          handle_kid_miss
        else
          cached_or_fetch
        end
      end

      def cached_or_fetch
        Rails.cache.fetch(jwks_cache_key, expires_in: CACHE_TTL) { fetch_jwks }
      end

      def handle_kid_miss
        if debounced?
          raise JWT::DecodeError,
                "LTI JWKS kid not found and debounce active for registration #{@registration.id}"
        end

        set_debounce
        old_jwks = Rails.cache.read(jwks_cache_key)
        Rails.cache.delete(jwks_cache_key)

        new_jwks = nil
        duration_ms = Benchmark.realtime { new_jwks = fetch_jwks } * 1000

        Rails.cache.write(jwks_cache_key, new_jwks, expires_in: CACHE_TTL)
        log_refetch(old_jwks, new_jwks, duration_ms)

        new_jwks
      end

      def fetch_jwks
        HTTParty.get(@registration.jwks_uri).parsed_response
      end

      def debounced?
        Rails.cache.exist?(debounce_cache_key)
      end

      def set_debounce
        Rails.cache.write(debounce_cache_key, true, expires_in: DEBOUNCE_TTL)
      end

      def jwks_cache_key
        "lti/jwks/#{@registration.id}"
      end

      def debounce_cache_key
        "lti/jwks_debounce/#{@registration.id}"
      end

      def log_refetch(old_jwks, new_jwks, duration_ms)
        Rails.logger.info(
          "LTI JWKS kid-miss refetch: " \
          "registration=#{@registration.id} " \
          "old_kid_count=#{kid_count(old_jwks)} " \
          "new_kid_count=#{kid_count(new_jwks)} " \
          "duration_ms=#{duration_ms.round(1)}"
        )
      end

      def kid_count(jwks_payload)
        return 0 if jwks_payload.blank?

        keys = jwks_payload.is_a?(Hash) ? (jwks_payload[:keys] || jwks_payload["keys"]) : []
        keys.is_a?(Array) ? keys.size : 0
      end
    end
  end
end
