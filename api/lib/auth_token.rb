# frozen_string_literal: true

# Responsible for encoding and decoding authentication tokens.
class AuthToken
  # ~ 1 month in minutes
  DEFAULT_TTL = 60 * 24 * 30

  class << self
    # Encode a hash in a json web token
    def encode(payload, ttl_in_minutes = DEFAULT_TTL)
      payload[:exp] = ttl_in_minutes.minutes.from_now.to_i

      JWT.encode(payload, Rails.application.secrets.secret_key_base)
    end

    # @param [User] user
    # @return [String]
    def encode_user(user)
      user_id = user.id

      payload = { user_id: user_id, }

      encode(payload)
    end

    # Decode a token and return the payload inside
    # If will throw an error if expired or invalid. See the docs for the JWT gem.
    def decode(token, leeway = nil)
      payload, = JWT.decode(token, Rails.application.secrets.secret_key_base, leeway: leeway)

      payload.with_indifferent_access
    end

    # @param [String, nil] header
    def authorized_admin?(header)
      case header
      when /\ABearer (?<token>\S+)\z/
        has_admin_privilege?(Regexp.last_match[:token])
      else
        false
      end
    rescue JWT::DecodeError, JWT::ExpiredSignature
      false
    end

    # @param [String, nil] header
    # @return [String, nil]
    def real_email_for(header)
      case header
      when /\ABearer (?<token>\S+)\z/
        fetch_real_email_for(Regexp.last_match[:token])
      end
    rescue JWT::DecodeError, JWT::ExpiredSignature
      nil
    end

    # Get the real email from a possibly suffixed email address.
    #
    # @param [String] email
    # @return [String, nil]
    def real_email_from(email)
      email&.gsub(/\A([^+]+?)\+[^@]+?@/, '\1@')
    end

    private

    # @param [String] token
    def has_admin_privilege?(token)
      user_id = decode(token).fetch(:user_id)

      Rails.cache.fetch("auth_token:admin:#{user_id}", expires_in: 1.hour) do
        User.with_role(:admin).exists?(id: user_id)
      end
    end

    # @param [String] token
    # @return [String, nil]
    def fetch_real_email_for(token)
      user_id = decode(token).fetch(:user_id)

      Rails.cache.fetch("auth_token:real_email:#{user_id}", expires_in: 1.hour) do
        email = User.where(id: user_id).pick(:email)

        AuthToken.real_email_from(email)
      end
    end
  end
end
