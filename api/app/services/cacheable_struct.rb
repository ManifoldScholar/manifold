# frozen_string_literal: true

# A Dry::Struct whose instances persist themselves to Rails.cache, addressed by an opaque minted token.
class CacheableStruct < Dry::Struct
  transform_keys(&:to_sym)

  class Error < StandardError; end
  class IdempotencyError < Error; end

  class << self
    def cache_ttl(duration = nil)
      return @cache_ttl = duration if duration

      @cache_ttl || raise(NotImplementedError, "#{self} must declare a cache_ttl")
    end

    def cache_key_prefix(prefix = nil)
      return @cache_key_prefix = prefix if prefix

      @cache_key_prefix || raise(NotImplementedError, "#{self} must declare a cache_key_prefix")
    end

    # @param token [String] the opaque token returned by {#persist!}
    # @return [CacheableStruct, nil] nil when the token is unknown or expired
    def find(token)
      payload = Rails.cache.read(cache_key(token))
      return if payload.blank?

      new(payload).tap { |record| record.send(:token=, token) }
    end

    def cache_key(token)
      "#{cache_key_prefix}/#{token}"
    end
  end

  attr_reader :token

  # @return [String] 64-character hex token
  def persist!
    raise IdempotencyError, "#{self.class} can only be persisted once" if token

    self.token = SecureRandom.hex(32)
    Rails.cache.write(self.class.cache_key(token), to_h, expires_in: self.class.cache_ttl)
    token
  end

  def consume!
    Rails.cache.delete(self.class.cache_key(token))
  end

  # Restarts the TTL clock; the token must already be persisted.
  def touch!
    raise Error, "#{self.class} must be persisted before it can be touched" unless token

    Rails.cache.write(self.class.cache_key(token), to_h, expires_in: self.class.cache_ttl)
  end

  private

  attr_writer :token
end
