# frozen_string_literal: true

module Lti
  module ResourceLink
    # Just-in-time enrollment on an LTI resource-link launch. If the launched
    # resource belongs to its course's reading group, the launching user is
    # added to that group with a role derived from the launch's LTI roles.
    #
    # Enrollment is best-effort: any failure is logged and swallowed so it never
    # blocks the user's launch. It no-ops unless the course has a reading group
    # AND the launched resource is one of that group's collectables.
    #
    # Role assignment ratchets up only: an Instructor launch ensures moderator;
    # any other launch leaves an existing role untouched (so manual promotions
    # and the creator's moderator role survive) and adds new users as members.
    class Enroll
      # @param omniauth_hash [OmniAuth::AuthHash, Hash] request.env["omniauth.auth"]
      # @param user [User] the authenticated launching user
      def initialize(omniauth_hash, user)
        @omniauth_hash = omniauth_hash
        @user = user
      end

      # @return [void]
      def call
        return unless reading_group
        return unless resource_in_group?

        enroll!
      rescue StandardError => e
        Rails.logger.error("Lti::ResourceLink::Enroll failed: #{e.class.name}: #{e.message}")
        nil
      end

      private

      attr_reader :omniauth_hash, :user

      def enroll!
        membership = reading_group.reading_group_memberships.find_or_initialize_by(user: user)
        membership.role = :moderator if instructor?
        membership.save! if membership.new_record? || membership.changed?
      end

      def instructor?
        Lti::ContextRole.new(roles).instructor?
      end

      def reading_group
        return @reading_group if defined?(@reading_group)

        @reading_group = course_context&.reading_group
      end

      def resource_in_group?
        return false unless resource_reference&.valid?

        ReadingGroupCompositeEntry.exists?(reading_group: reading_group, collectable: resource_reference.entity)
      end

      def resource_reference
        return @resource_reference if defined?(@resource_reference)

        params = Rack::Utils.parse_nested_query(URI.parse(target_link_uri.to_s).query.to_s)
        @resource_reference =
          if params["redirect_type"].present? && params["redirect_id"].present?
            Lti::ResourceReference.new(type: params["redirect_type"], id: params["redirect_id"])
          end
      rescue URI::InvalidURIError
        @resource_reference = nil
      end

      def course_context
        return @course_context if defined?(@course_context)

        @course_context = deployment && LtiCourseContext.find_by(lti_deployment: deployment, context_id: context_claim["id"])
      end

      def deployment
        return @deployment if defined?(@deployment)

        @deployment = registration && LtiDeployment.find_by(lti_registration: registration, deployment_id: lti_claims["deployment_id"])
      end

      def registration
        return @registration if defined?(@registration)

        @registration = LtiRegistration.find_by(issuer: raw_info["iss"], client_id: raw_info["aud"])
      end

      def roles
        lti_claims["roles"]
      end

      def context_claim
        lti_claims["context"] || {}
      end

      def lti_claims
        @lti_claims ||= omniauth_hash&.dig("extra", "lti") || {}
      end

      def raw_info
        @raw_info ||= omniauth_hash&.dig("extra", "raw_info") || {}
      end

      def target_link_uri
        omniauth_hash&.dig("extra", "target_link_uri")
      end
    end
  end
end
