module API
  module V1
    module Journals
      module Relationships
        class EntitlementsController < AbstractJournalChildController
          include API::V1::BuildsScopedEntitlements

          resourceful! Entitlement, authorize_options: { except: [:index] } do
            Entitlement.filtered(
              with_pagination!(entitlement_filter_params),
              scope: Entitlement.where(subject_type: "Journal", subject_id: params[:journal_id])
            )
          end

          def index
            authorize_action_for Entitlement, for: @journal
            @entitlements = load_entitlements

            location = api_v1_journal_relationships_entitlements_url(journal_id: params[:journal_id])

            render_multiple_resources @entitlements, location: location, include: INCLUDES
          end

          def create
            @entitlement = build_entitlement_for @journal

            inputs = scoped_entitlement_inputs_for @entitlement

            outcome = Entitlements::ScopedCreate.run inputs

            if outcome.valid?
              render_single_resource outcome.result, location: location_for(outcome.result), include: [:target]
            else
              respond_with_errors outcome
            end
          end

          private

          def location_for(entitlement)
            api_v1_entitlement_url(entitlement)
          end
        end
      end
    end
  end
end
