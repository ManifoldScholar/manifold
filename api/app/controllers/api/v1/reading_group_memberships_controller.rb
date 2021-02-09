module API
  module V1
    class ReadingGroupMembershipsController < ApplicationController
      before_action :authenticate_request!

      resourceful! ReadingGroupMembership do
        ReadingGroupMembership.all
      end

      authority_actions activate: :update, archive: :update

      def show
        @reading_group_membership = load_and_authorize_reading_group_membership

        render_single_resource @reading_group_membership
      end

      def create
        updater = ::Updaters::ReadingGroupMembership.new reading_group_membership_params

        @reading_group_membership = ReadingGroupMembership.new

        updater.update_without_save @reading_group_membership

        authorize_action_for @reading_group_membership

        if @reading_group_membership.upsert
          # active-record-upsert sometimes needs a fresh find of the model
          @reading_group_membership = ReadingGroupMembership.find @reading_group_membership.id

          @reading_group_membership.activate! if @reading_group_membership.may_activate?
        end

        render_single_resource @reading_group_membership
      end

      def update
        @reading_group_membership = load_and_authorize_reading_group_membership

        ::Updaters::ReadingGroupMembership.new(reading_group_membership_params).update(@reading_group_membership)

        render_single_resource @reading_group_membership
      end

      def destroy
        @reading_group_membership = load_and_authorize_reading_group_membership

        if @reading_group_membership.destroy
          head :no_content
        else
          render_single_resource @reading_group_membership
        end
      end

      def activate
        perform_transition! event_name: :activate
      end

      def archive
        perform_transition! event_name: :archive
      end

      private

      def perform_transition!(event_name: action_name)
        @reading_group_membership = load_and_authorize_reading_group_membership

        event_method = :"#{event_name}!"

        @reading_group_membership.public_send event_method

        render_single_resource @reading_group_membership
      rescue AASM::InvalidTransition => e
        error = { code: :invalid_membership_transition, title: "Cannot Transition Membership", detail: e.message }

        errors = [error]

        render json: { errors: errors }, status: :unprocessable_entity
      end
    end
  end
end
