module Notifications
  class ComposeDigestEvents < ActiveInteraction::Base
    DEFAULT_INCLUDES = [
      :project,
      :subject,
      { project: [:creators, :texts, :resource_collections, :resources] }
    ].freeze

    record :user
    record :frequency, class: "NotificationFrequency", finder: :[]

    def execute
      {}.with_indifferent_access.tap do |out|
        out["projects"] = fetch_events_for_projects
        out["annotations_and_comments"] = fetch_events_for_annotations_and_comments
      end
    end

    # @!attribute [r] kinds
    # @return [<NotificationKind>]
    def kinds
      @kinds ||= user.notification_preferences.by_frequency(:always).map(&:kind)
    end

    # @!attribute [r] project_ids
    # @return [<String>]
    def project_ids
      @project_ids ||= projects_scope.ids
    end

    # @!attribute [r] time_range
    # @return [Range<ActiveSupport::TimeWithZone>]
    def time_range
      @time_range ||= build_time_range
    end

    private

    # @return [{ Project => <Event> }]
    def fetch_events_for_projects
      return {} unless include_any_digest?(:projects, :followed_projects)

      event_scope("Text", "Resource", "ResourceCollection", &:project)
    end

    # @return [{ Project => <Event> }]
    def fetch_events_for_annotations_and_comments
      return {} unless include_digest? :digest_comments_and_annotations

      annotations = event_scope("Annotation", to_include: { subject: { text: :text_sections } }, &:project)
      comments = event_scope("Comment", to_include: { subject: :subject }) { |e| e.subject.subject.project }

      annotations.merge(comments) { |_key, a_events, c_events| a_events + c_events }
    end

    # @return [{ Project => <Event> }]
    def event_scope(*subject_types, to_include: nil)
      raise "Must include group_by block" unless block_given?

      includes = DEFAULT_INCLUDES.deep_dup
      includes << to_include if to_include.present?

      subject_types.flatten!

      Event.by_subject_type(subject_types)
        .includes(includes)
        .where(project: project_ids)
        .created(time_range)
        .group_by(&Proc.new)
    end

    # @return [ActiveRecord::Relation<Project>]
    def projects_scope
      include_digest?(:projects) ? Project.with_read_ability(user) : user.favorite_projects
    end

    # @param [NotificationKind, String, Symbol] kind
    def include_digest?(kind)
      kind.in? kinds
    end

    # @param [<NotificationKind, String, Symbol>] kinds
    def include_any_digest?(*kinds)
      kinds.flatten.any? { |kind| include_digest? kind }
    end

    # @return [Range<ActiveSupport::TimeWithZone>]
    def build_time_range
      now = Time.current

      time = frequency.daily? ? now.yesterday : now.last_week

      time.at_beginning_of_day..now.at_beginning_of_day
    end
  end
end
