# frozen_string_literal: true

class LtiCourseContext < ApplicationRecord
  belongs_to :lti_deployment
  belongs_to :reading_group, optional: true

  validates :context_id, presence: true,
                         uniqueness: { scope: :lti_deployment_id }
end
