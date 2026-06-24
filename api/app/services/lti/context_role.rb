# frozen_string_literal: true

module Lti
  # Interprets an LTI 1.3 `roles` claim to answer whether a launch carries a
  # context (course) Instructor role. Only the membership vocabulary counts —
  # institution and system roles are deliberately ignored, since they describe
  # org/platform standing rather than the user's role in this course.
  #
  # Recognizes all three forms an Instructor context role can take:
  #   - the bare simple name "Instructor" (deprecated, but still emitted)
  #   - the core URI .../membership#Instructor
  #   - any sub-role .../membership/Instructor#<SubRole> (e.g. TeachingAssistant)
  class ContextRole
    MEMBERSHIP_VOCAB = "http://purl.imsglobal.org/vocab/lis/v2/membership"
    INSTRUCTOR_REGEXP = %r((?:#{MEMBERSHIP_VOCAB}[#/]?)?).freeze
    INSTRUCTOR_VOCAB = "Instructor"

    # @param roles [Array<String>, nil] the LTI roles claim
    def initialize(roles)
      @roles = Array(roles)
    end

    # @return [Boolean] true when any role is a context Instructor (any sub-role)
    def instructor?
      roles.any? { |role| instructor_role?(role) }
    end

    private

    attr_reader :roles

    def instructor_role?(role)
      role.to_s.gsub(INSTRUCTOR_REGEXP, "").downcase.start_with?(INSTRUCTOR_VOCAB.downcase)
    end
  end
end
