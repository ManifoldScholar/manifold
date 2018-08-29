module Notifications
  class ComposeDigestEvents < ActiveInteraction::Base
    object :user
    string :frequency
    validates_inclusion_of :frequency, in: NotificationFrequency

    def execute
      compile_events
    end

    private

    # rubocop:disable Metrics/LineLength
    def compile_events
      {}.with_indifferent_access.tap do |out|
        out["projects"] = projects
        out["annotations_and_comments"] = annotations_and_comments
      end
    end
    # rubocop:enable Metrics/LineLength

    def projects
      return {} unless include_digest?(NotificationKind[:projects]) ||
                       include_digest?(NotificationKind[:followed_projects])
      event_scope.created(date_range)
                 .by_subject_type(%w(Text Resource Collection))
                 .group_by(&:project)
    end

    # rubocop:disable Metrics/AbcSize, Metrics/LineLength
    def annotations_and_comments
      return {} unless include_digest? NotificationKind[:digest_comments_and_annotations]

      annotations = event_scope(subject: { text: :text_sections }).created(date_range)
                                                                  .by_subject_type("Annotation")
                                                                  .group_by(&:project)
      comments = event_scope(subject: :subject).created(date_range)
                                               .by_subject_type("Comment")
                                               .group_by { |e| e.subject.subject.project }

      annotations.merge(comments) { |_key, a_events, c_events| a_events + c_events }
    end
    # rubocop:enable Metrics/AbcSize, Metrics/LineLength

    def projects_scope
      if include_digest?(NotificationKind[:projects])
        Project.with_read_ability(user).pluck(:id)
      else
        user.favorite_projects.pluck(:id)
      end
    end

    def event_scope(to_include = nil)
      includes = [:project,
                  :subject,
                  project: [:creators, :texts, :collections, :resources]]
      includes << to_include if to_include.present?

      Event.includes(includes).where(project: projects_scope)
    end

    def kinds
      @kinds ||= user.notification_preferences
                     .by_frequency(NotificationFrequency[:always])
                     .map(&:kind)
    end

    def include_digest?(kind)
      kind.in? kinds
    end

    def date_range
      time = if NotificationFrequency.fetch(frequency) == NotificationFrequency[:daily]
               Time.current.yesterday
             else
               Time.current.last_week
             end

      time.at_beginning_of_day..Time.current.at_beginning_of_day
    end

  end
end
