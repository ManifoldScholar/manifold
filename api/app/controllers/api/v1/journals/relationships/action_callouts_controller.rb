module API
  module V1
    module Journals
      module Relationships
        class ActionCalloutsController < AbstractJournalChildController

          resourceful! ActionCallout, authorize_options: { except: [:index] } do
            @journal.action_callouts
          end

          def index
            @action_callouts = load_action_callouts
            location = api_v1_journal_relationships_action_callouts_url(@journal.id)
            render_multiple_resources @action_callouts,
                                      location: location
          end

          def create
            @action_callout =
              ::Updaters::ActionCallout.new(action_callout_params)
                .update(@journal.action_callouts.new)
            @action_callout.save
            authorize_action_for @action_callout

            render_single_resource @action_callout,
                                   location: location
          end

          private

          def location
            return "" unless @action_callout.persisted?

            api_v1_action_callout_url(@action_callout, journal_id: @journal.id)
          end

        end
      end
    end
  end
end
