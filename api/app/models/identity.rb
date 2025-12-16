# frozen_string_literal: true

class Identity < ApplicationRecord
  include ProvidesEntitlements

  attribute :provider, Inquiry.new

  belongs_to :user, optional: false, inverse_of: :identities

  has_many :user_group_memberships, as: :source, dependent: :destroy

  validates :provider, inclusion: { in: ->(_) { (ManifoldEnv.oauth.known_strategies + SamlConfig.provider_names) } }
  validates :uid, :provider, presence: true
  validates :uid, uniqueness: { scope: %i(provider) }

  scope :provider, ->(name) { rewhere(provider: name) }
  scope :uid, ->(uid) { rewhere(uid: uid) }

  delegate :facebook?, :google_oauth2?, :twitter?, to: :provider

  alias google? google_oauth2?

  class << self
    # @param [OmniAuth::AuthHash] auth_env
    # @option auth_env [String] provider
    # @option auth_env [String] uid
    # @return [ProviderAuthorization]
    def from_omniauth(auth_env)
      provider(auth_env["provider"]).uid(auth_env["uid"]).first_or_initialize
    end
  end

  def name
    "#{provider} identity for #{user.name}"
  end
end
