# frozen_string_literal: true

module Entitlements
  class DescribeSubject
    include Dry::Monads[:result]

    # @param [Entitleable, Entitlement, PendingEntitlement] subject
    # @return [String]
    def call(subject)
      return call(subject.subject) if Entitlements::Subjects::Subjectable.(subject)

      Entitlements::Subjects::Matcher.(subject) do |m|
        m.journal do |journal|
          Success "to the journal, #{journal.title.inspect}"
        end

        m.project do |project|
          Success "to the project, #{project.title.inspect}"
        end

        m.project_collection do |project_collection|
          Success "to the project collection, #{project_collection.title.inspect}"
        end

        m.subscription do
          Success "as a subscriber"
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
