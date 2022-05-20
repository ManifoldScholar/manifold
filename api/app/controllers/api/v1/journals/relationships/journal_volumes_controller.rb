module API
  module V1
    module Journals
      module Relationships
        class JournalVolumesController < AbstractJournalChildController

          resourceful! JournalVolume, authorize_options: { except: [:index] } do
            JournalIssue.filtered(
              with_pagination!({}), scope: @journal.journal_volumes.in_reverse_order
            )
          end

          def index
            @journal_volumes = load_journal_volumes
            location = api_v1_journal_relationships_journal_volumes_url(@journal.id)
            render_multiple_resources @journal_volumes,
                                      location: location
          end

          def create
            @journal_volume =
              ::Updaters::Default.new(journal_volume_params)
                .update(@journal.journal_volumes.new(creator: current_user))
            authorize_action_for @journal_volume

            @journal_volume.save
            render_single_resource @journal_volume,
                                   location: location
          end

          private

          def location
            return "" unless @journal_volume.persisted?

            api_v1_journal_volume_url(@journal_volume)
          end

        end
      end
    end
  end
end
