module API
  module V1
    # Journals controller
    class JournalsController < ApplicationController

      resourceful! Journal, authorize_options: { except: [:index, :show] } do
        Journal.filtered(
          with_pagination!(journal_filter_params),
          scope: scope_visibility,
          user: current_user
        )
      end

      def index
        @journals = load_journals
        render_multiple_resources @journals, include: [:recent_journal_volumes, :recent_journal_issues]
      end

      def show
        @journal = scope_for_journals.find(params[:id])
        authorize_action_for @journal
        render_single_resource @journal, include: includes
      end

      def create
        @journal = ::Updaters::Journal.new(journal_params).update(Journal.new(creator: current_user))
        authorize_action_for @journal
        render_single_resource @journal
      end

      def update
        @journal = load_and_authorize_journal
        ::Updaters::Journal.new(journal_params).update(@journal)
        render_single_resource @journal,
                               include: includes
      end

      def destroy
        @journal = load_and_authorize_journal
        @journal.destroy
      end

      protected

      def includes
        [:action_callouts, :recent_journal_volumes, "journal_volumes.journal_issues", :recent_journal_issues, :permitted_users, :subjects]
      end

      def scope_for_journals
        Journal.friendly
      end

      def scope_visibility
        return Journal.with_read_ability current_user unless project_filter_params&.dig(:with_update_ability)

        Journal.all
      end

    end
  end
end
