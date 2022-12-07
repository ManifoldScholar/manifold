# frozen_string_literal: true

module Entitlements
  module Subjects
    Subjectable = ->(o) do
      o.kind_of?(::Entitlement) || o.kind_of?(::PendingEntitlement)
    end

    # @api private
    MatchJournal = Dry::Matcher::Case.new do |subject, _|
      if subject.kind_of?(::Journal)
        subject
      else
        Dry::Matcher::Undefined
      end
    end

    # @api private
    MatchProject = Dry::Matcher::Case.new do |subject, _|
      if subject.kind_of?(::Project)
        subject
      else
        Dry::Matcher::Undefined
      end
    end

    # @api private
    MatchProjectCollection = Dry::Matcher::Case.new do |subject, _|
      if subject.kind_of?(::ProjectCollection)
        subject
      else
        Dry::Matcher::Undefined
      end
    end

    MatchSubscription = Dry::Matcher::Case.new do |subject, _|
      if subject.kind_of?(::SystemEntitlement) && subject.subscription?
        subject
      else
        Dry::Matcher::Undefined
      end
    end

    MatchUnknown = Dry::Matcher::Case.new do |subject, _|
      subject
    end

    # @see Entitlement#on_subject
    Matcher = Dry::Matcher.new(
      journal: MatchJournal,
      project: MatchProject,
      project_collection: MatchProjectCollection,
      subscription: MatchSubscription,
      unknown: MatchUnknown
    )
  end
end
