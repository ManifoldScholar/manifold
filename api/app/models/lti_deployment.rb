# frozen_string_literal: true

class LtiDeployment < ApplicationRecord
  belongs_to :lti_registration

  validates :deployment_id, presence: true, uniqueness: { scope: :lti_registration_id }

  scope :enabled, -> { where(enabled: true) }
end
