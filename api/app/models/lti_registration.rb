# frozen_string_literal: true

class LtiRegistration < ApplicationRecord
  include Authority::Abilities
  include SerializedAbilitiesFor
  include HasStateMachine

  has_state_machine! initial_state: :pending

  has_many :lti_deployments, dependent: :destroy

  validates :name, :issuer, :client_id, :authorization_endpoint, :token_endpoint, :jwks_uri,
            :token_endpoint_auth_method, presence: true
  validates :client_id, uniqueness: { scope: :issuer }

  %i[pending approved denied blocked].each do |state|
    scope state, -> { in_state(state) }
  end

  before_create :derive_host

  class << self
    def blocked?(host)
      blocked.exists?(host: host)
    end
  end

  def derive_host
    self.host = issuer_uri.host
  end

  def issuer_uri
    URI.parse(issuer)
  end
end
