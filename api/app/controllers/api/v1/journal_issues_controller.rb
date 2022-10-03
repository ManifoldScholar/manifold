module API
  module V1
    # Journal Issues controller
    class JournalIssuesController < ApplicationController

      resourceful! JournalIssue, authorize_options: { except: [:index, :show] } do
        JournalIssue.filtered(
          with_pagination!(journal_issue_filter_params),
          scope: scope_visibility,
          user: current_user
        )
      end

      def index
        @journal_issues = load_journal_issues
        render_multiple_resources @journal_issues, include: ["journal"]
      end

      def show
        @journal_issue = scope_for_journal_issues.find(params[:id])
        authorize_action_for @journal_issue
        render_single_resource @journal_issue, include: includes
      end

      def update
        @journal_issue = load_and_authorize_journal_issue
        ::Updaters::Default.new(journal_issue_params).update(@journal_issue)
        render_single_resource @journal_issue,
                               include: includes
      end

      def destroy
        @journal_issue = load_and_authorize_journal_issue
        @journal_issue.destroy
      end

      protected

      def includes
        [:journal, :journal_volume, :project, "project.creators", "project.contributors",
         "project.texts", "project.text_categories", "project.events",
         "project.resource_collections", "project.resources", "project.subjects",
         "project.twitter_queries", "project.permitted_users", "project.content_blocks",
         "project.action_callouts"]
      end

      def scope_visibility
        JournalIssue.with_read_ability(current_user).in_reverse_order
      end

      def scope_for_journal_issues
        JournalIssue.all
      end

    end
  end
end
