module API
  module V1
    # Reading groups controller
    class ReadingGroupsController < ApplicationController
      include MonadicControllerActions

      SERIALIZED_INCLUDES = %i[kind collection].freeze

      resourceful! ReadingGroup do
        ReadingGroup.includes(:reading_group_collection, :reading_group_kind, reading_group_memberships: %i[user])
      end

      authority_actions do_clone: :update, join: :read

      def index
        @reading_groups = load_reading_groups

        respond_with_forbidden("reading groups", "list") && return unless ReadingGroup.listable_by?(current_user)

        render_multiple_resources @reading_groups, include: SERIALIZED_INCLUDES
      end

      def show
        @reading_group = uuid? ? load_and_authorize_reading_group : lookup_reading_group

        render_single_resource @reading_group,
                               include: [*SERIALIZED_INCLUDES, "annotated_texts", "reading_group_memberships.user"]
      end

      def create
        @reading_group = authorize_and_create_reading_group(reading_group_params, assign_before_auth: :privacy)
        render_single_resource @reading_group
      end

      def update
        @reading_group = load_and_authorize_reading_group
        ::Updaters::ReadingGroup.new(reading_group_params).update(@reading_group)
        render_single_resource @reading_group
      end

      def destroy
        @reading_group = load_and_authorize_reading_group
        @reading_group.destroy
      end

      # @note API endpoint is clone. Named `do_clone` to avoid overriding core ruby method
      #   and potentially introducing hard-to-track-down bugs.
      def do_clone
        @reading_group = load_and_authorize_reading_group

        provided_options = parse_jsonapi_attributes(attribute_parser: ::ReadingGroups::Clone::Options)

        options = {
          **provided_options,
          reading_group: @reading_group,
          user: current_user
        }

        handle_monadic_operation! "reading_groups.clone", options do |m|
          m.success do |cloned_reading_group|
            render_single_resource cloned_reading_group
          end
        end
      end

      def join
        @reading_group = load_and_authorize_reading_group

        options = {
          reading_group: @reading_group,
          user: current_user
        }

        handle_monadic_operation! "reading_groups.join_public", options do |m|
          m.success do |reading_group_membership|
            render_single_resource reading_group_membership, serializer: ::V1::ReadingGroupMembershipSerializer
          end
        end
      end

      private

      def uuid?
        UUID.validate(params[:id])
      end

      def lookup_reading_group
        ReadingGroup.by_invitation_code(params[:id])
      end
    end
  end
end
