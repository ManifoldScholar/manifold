# frozen_string_literal: true

module Entitlements
  class GetSubjectTitle
    include Dry::Monads[:result]

    # @param [Entitleable, Entitlement, PendingEntitlement] subject
    # @return [String]
    def call(subject)
      return call(subject.subject) if Entitlements::Subjects::Subjectable.(subject)

      Entitlements::Subjects::Matcher.(subject) do |m|
        m.journal do |journal|
          Success "Journal (#{journal.title.inspect})"
        end

        m.project do |project|
          Success "Project (#{project.title.inspect})"
        end

        m.project_collection do |project_collection|
          Success "Project Collection (#{project_collection.title.inspect})"
        end

        m.subscription do
          Success "Subscription"
        end

        m.unknown do |subj|
          # :nocov:
          Failure[:unknown_subject, subj]
          # :nocov:
        end
      end
    end
  end
end
