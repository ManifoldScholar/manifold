module Factory
  # Factory class for creating Event models
  class Event
    def create(event_type, subject_id: nil, subject_type: nil, subject: nil)
      subject = resolve_subject(subject_id, subject_type, subject)
      raise_no_subject unless subject
      event = ::Event.find_or_create_by(subject: subject,
                                        event_type: event_type,
                                        project: subject_project(subject))
      event.update(event_title: event_title(event_type),
                   event_subtitle: event_subtitle(event_type),
                   subject_title: subject_title(event_type, subject),
                   subject_subtitle: subject_subtitle(event_type, subject),
                   attribution_name: subject_attribution_name(event_type, subject))
      log_event_errors(event)
      event
    end

    private

    def log_event_errors(event)
      return unless event.errors.any?
      Rails.logger.debug("Factory::Event invalid event: #{event.errors.full_messages}")
    end

    def subject_attribution_name(_type, subject)
      subject&.creator_name
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
      subject.respond_to?(:title) ? subject.title : nil
    end

    def event_title(type)
      t("event_title", type)
    end

    def event_subtitle(type)
      t("event_subtitle", type)
    end

    # rubocop:disable LineLength
    def raise_no_project
      raise "Factory::Event can only create events for subjects that have or are a project"
    end
    # rubocop:enable LineLength

    # rubocop:disable LineLength
    def raise_no_subject
      raise "Factory::Event requires a valid subject or subject_type and subject_id"
    end
    # rubocop:enable LineLength

    def resolve_subject(id, type, model)
      return model if model
      if type && id
        klass = Module.const_get(type)
        return nil unless klass.is_a?(Class)
        subject = klass.find_by_id(id)
        return subject
      end
      nil
    end

    def t(path, type)
      key = "services.factory.event.#{path}.#{type.downcase}"
      return I18n.t(key) if i18n_set?(key)
      nil
    end

    def i18n_set?(key)
      begin
        t = I18n.t key, raise: true
      rescue
        false
      end
      !t.blank?
    end
  end
end
