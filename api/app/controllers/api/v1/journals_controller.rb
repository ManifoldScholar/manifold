# frozen_string_literal: true

module API
  module V1
    # Journals controller
    class JournalsController < ApplicationController
      resourceful! Journal, authorize_options: { except: [:index, :show] } do
        Journal.filtered(
          **with_pagination!(journal_filter_params),
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

      private

      def journal_params
        params.require(:data)
        attributes = [:title, :subtitle, :hashtag, :description, :facebook_id, :twitter_id,
                      :instagram_id, :remove_avatar, attachment(:avatar),
                      attachment(:hero), attachment(:logo), :remove_hero, :draft,
                      :remove_logo, metadata(Journal), :avatar_color, :pending_slug,
                      { tag_list: [] }, :image_credits, :social_description,
                      attachment(:custom_icon), :hero_layout, :remove_custom_icon,
                      :social_title, attachment(:social_image), :remove_social_image,
                      :hero_background_color, :show_on_homepage, :home_page_priority, :external_identifier]

        relationships = [:collaborators, :creators, :contributors, :subjects]
        param_config = structure_params(attributes: attributes, relationships: relationships)
        params.permit(param_config)
      end
    end
  end
end
