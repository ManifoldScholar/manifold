# frozen_string_literal: true

module API
  module V1
    module Journals
      module Relationships
        class JournalIssuesController < AbstractJournalChildController
          include AuthorizesJSONAPIRelationships

          resourceful! JournalIssue, authorize_options: { except: [:index] } do
            JournalIssue.filtered(
              **with_pagination!(journal_issue_filter_params), scope: @journal.journal_issues.in_reverse_order, user: current_user
            )
          end

          before_action :maybe_enforce_project_access!, only: :create

          def index
            @journal_issues = load_journal_issues
            location = api_v1_journal_relationships_journal_issues_url(@journal.id)
            render_multiple_resources @journal_issues,
                                      location: location
          end

          def create
            inputs = {}

            inputs[:params] = journal_issue_params.to_h
            inputs[:creator] = current_user
            inputs[:journal] = @journal

            authorize_action_for JournalIssue.new(journal: @journal)

            outcome = JournalIssues::Create.run inputs

            render_single_resource outcome.result
          end

          private

          # Check to make sure that the user is authorized to update the project, if present.
          # @return [void]
          def maybe_enforce_project_access!
            authorize_jsonapi_relationship_in! journal_issue_params, Project
          end

          def location
            return "" unless @journal_issue.persisted?

            api_v1_journal_issue_url(@journal_issue)
          end
        end
      end
    end
  end
end
