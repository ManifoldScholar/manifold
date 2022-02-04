module API
  module V1
    # Journal Volumes controller
    class JournalVolumesController < ApplicationController

      resourceful! JournalVolume, authorize_options: { except: [:index, :show] } do
        JournalVolume.all
      end

      def show
        @journal_volume = JournalVolume.find(params[:id])
        authorize_action_for @journal_volume
        render_single_resource @journal_volume, include: includes
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
        [:journal_issues, "journal_issues.project", "journal_issues.project_content_blocks", "journal_issues.project_texts"]
      end

      def scope_for_journal_volumes
        JournalVolume.friendly
      end

    end
  end
end
