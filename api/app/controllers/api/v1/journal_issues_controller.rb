module API
  module V1
    # Journal Issues controller
    class JournalIssuesController < ApplicationController

      resourceful! JournalIssue, authorize_options: { except: [:index, :show] } do
        JournalIssue.all
      end

      def show
        @journal_issue = JournalIssue.find(params[:id])
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
        [:project, :journal_volume, :project_content_blocks, :journal]
      end

      def scope_visibility
        JournalIssue.all
      end

    end
  end
end
