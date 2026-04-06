# frozen_string_literal: true

class LtiRegistration < ApplicationRecord
  has_many :lti_deployments, dependent: :destroy

  validates :name, :issuer, :client_id, :authorization_endpoint, :token_endpoint, :jwks_uri,
            :token_endpoint_auth_method, presence: true
  validates :client_id, uniqueness: { scope: :issuer }

  scope :enabled, -> { where(enabled: true) }

  class << self
    def find_by_issuer_and_client_id!(issuer, client_id)
      enabled.find_by!(issuer: issuer, client_id: client_id)
    end
  end
end
