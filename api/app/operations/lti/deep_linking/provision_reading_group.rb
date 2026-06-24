# frozen_string_literal: true

module Lti
  module DeepLinking
    # Create-or-reuse the single reading group for a course context and attach
    # the selected resources to it. Setting `creator` enrolls the instructor as
    # a moderator via ReadingGroup's after_save hook; collect_model! is
    # idempotent, so re-submissions add resources without duplicating the group.
    class ProvisionReadingGroup
      # @param course_context [LtiCourseContext]
      # @param user [User] the deep-linking instructor (becomes creator/moderator)
      # @param references [Array<Lti::ResourceReference>] validated, resolvable refs
      def initialize(course_context:, user:, references:)
        @course_context = course_context
        @user = user
        @references = references
      end

      # @return [ReadingGroup]
      def call
        ReadingGroup.transaction do
          references.each { |reference| reading_group.collect_model!(reference.entity) }
        end

        reading_group
      end

      private

      attr_reader :course_context, :user, :references

      def reading_group
        @reading_group ||= course_context.reading_group || create_reading_group!
      end

      def create_reading_group!
        ReadingGroup.create!(name: reading_group_name, privacy: "private", creator: user).tap do |group|
          course_context.update!(reading_group: group)
        end
      end

      # The LTI context guarantees only `id`; title and label are optional, so we
      # fall back to a recognizable, non-leaky placeholder the instructor renames.
      def reading_group_name
        course_context.context_title.presence ||
          course_context.context_label.presence ||
          "#{user.name}'s Course"
      end
    end
  end
end
