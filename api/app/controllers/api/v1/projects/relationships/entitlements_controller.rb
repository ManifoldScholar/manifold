module Api
  module V1
    module Projects
      module Relationships
        class EntitlementsController < ApplicationController
          include Api::V1::BuildsScopedEntitlements

          resourceful! Entitlement do
            Entitlement.where(subject_type: "Project", subject_id: params[:project_id])
          end

          def index
            @entitlements = load_entitlements

            location = api_v1_project_relationships_entitlements_url(project_id: params[:project_id])

            render_multiple_resources @entitlements, location: location, include: INCLUDES
          end

          def create
            @project = Project.friendly.find params[:project_id]

            @entitlement = build_entitlement_for @project

            inputs = scoped_entitlement_inputs_for @entitlement

            outcome = Entitlements::ScopedCreate.run inputs

            if outcome.valid?
              render_single_resource outcome.result, location: location_for(outcome.result)
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
