module API
  module V1
    # Journal Volumes controller
    class JournalVolumesController < ApplicationController

      resourceful! JournalVolume, authorize_options: { except: [:index, :show] } do
        JournalVolume.all
      end

      def show
        @journal_volume = scope_for_journal_volumes.find(params[:id])
        authorize_action_for @journal_volume
        render_single_resource @journal_volume, include: includes, params: { include_all_tocs: true }
      end

      def update
        @journal_volume = load_and_authorize_journal_volume
        ::Updaters::Default.new(journal_volume_params).update(@journal_volume)
        render_single_resource @journal_volume,
                               include: includes
      end

      def destroy
        @journal_volume = load_and_authorize_journal_volume
        @journal_volume.destroy
      end

      protected

      def includes
        [:journal_issues, "journal_issues.project", "journal_issues.texts",
         "journal_issues.text_categories", "journal_issues.content_blocks"]
      end

      def scope_for_journal_volumes
        JournalVolume.friendly
      end

    end
  end
end
