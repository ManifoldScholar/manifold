module Factory
  # Factory class for creating Event models
  class Event
    def initialize
      @settings = Settings.instance
    end

    # rubocop:disable Metrics/MethodLength
    def create(event_type, subject_id: nil, subject_type: nil, subject: nil)
      ApplicationRecord.transaction do
        subject = resolve_subject(subject_id, subject_type, subject)
        raise_no_subject unless subject
        event = ::Event.find_or_create_by(
          subject: subject,
          event_type: event_type,
          project: subject_project(subject)
        )

        event.update(event_title: event_title(event_type),
                     event_subtitle: event_subtitle(event_type),
                     subject_title: subject_title(event_type, subject),
                     subject_subtitle: subject_subtitle(event_type, subject),
                     attribution_name: subject_attribution_name(event_type, subject),
                     event_url: new_text_event_url(event_type, subject))
        log_event_errors(event)
        event
      end
    end
    # rubocop:enable Metrics/MethodLength

    # rubocop:disable Metrics/MethodLength
    def create_from_tweet(tweet, query)
      subject = query
      raise_no_subject unless subject
      project = subject_project(subject)
      event = ::Event.find_or_create_by(
        event_type: ::EventType[:tweet],
        project: project,
        subject: query,
        external_subject_id: tweet.id,
        external_subject_type: "Tweet"
      )
      event.update(
        event_title: "Tweet Created",
        event_subtitle: nil,
        subject_title: "@#{tweet.user.screen_name}",
        excerpt: tweet.text,
        created_at: tweet.created_at,
        attribution_name: tweet.user.name,
        attribution_url: tweet.user.uri,
        attribution_identifier: tweet.user.screen_name,
        event_url: tweet.uri
      )
      log_event_errors(event)
      event
    end
    # rubocop:enable Metrics/MethodLength

    private

    def log_event_errors(event)
      return unless event.errors.any?

      Rails.logger.debug("Factory::Event invalid event: #{event.errors.full_messages}")
    end

    def subject_attribution_name(_type, subject)
      subject&.creator_name if subject.respond_to? :creator_name
    end

    def subject_project(subject)
      return subject if subject.is_a? Project
      return subject.project if subject.respond_to?(:project)

      raise_no_project
    end

    def subject_subtitle(_type, subject)
      subject.respond_to?(:subtitle) ? subject.subtitle : nil
    end

    def subject_title(_type, subject)
      return nil unless subject.respond_to?(:title)
      return subject.title unless subject.respond_to?(:title_formatted)

      subject.title_formatted
    end

    def event_title(type)
      t("event_title", type)
    end

    def event_subtitle(type)
      t("event_subtitle", type)
    end

    def new_text_event_url(type, subject)
      case type
      when ::EventType[:text_added]
        "/read/#{subject.id}"
      when ::EventType[:resource_collection_added], ::EventType[:resource_added]
        "/project/#{subject.project.id}/#{subject.class.name}/#{subject.id}"
      end
    end

    def raise_no_project
      msg = "Factory::Event can only create events for subjects that have or are a project"
      raise ::Factory::Errors::NoEventProject, msg
    end

    def raise_no_subject
      msg = "Factory::Event requires a valid subject or subject_type and subject_id"
      raise ::Factory::Errors::NoEventSubject, msg
    end

    def resolve_subject(id, type, model)
      return model if model

      if type && id
        klass = Module.const_get(type)
        return nil unless klass.is_a?(Class)

        subject = klass.find_by(id: id)
        return subject
      end
      nil
    end

    def t(path, type)
      key = "services.factory.event.#{path}.#{type.to_s.downcase}"
      return nil unless i18n_set?(key)

      I18n.t(key, global_installation_name: @settings.general[:installation_name])
    end

    def i18n_set?(key)
      begin
        t = I18n.t key, raise: true
      rescue StandardError
        false
      end
      !t.blank?
    end
  end
end
