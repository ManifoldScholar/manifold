# frozen_string_literal: true

module API
  module V1
    # Projects controller
    class ProjectsController < ApplicationController
      resourceful! Project, authorize_options: { except: [:index, :show] } do
        Project.filtered(
          **with_pagination!(project_filter_params&.with_defaults(no_issues: true)),
          scope: scope_visibility.includes(:creators),
          user: current_user
        )
      end

      def index
        @projects = load_projects
        render_multiple_resources @projects, include: [:creators]
      end

      def show
        @project = scope_for_projects.find(params[:id])
        authorize_action_for @project
        render_single_resource @project, include: includes, params: { include_toc: @project.texts_in_toc_blocks_ids }
      end

      def create
        @project = ::Updaters::Project.new(project_params).update(Project.new(creator: current_user))
        authorize_action_for @project
        Content::ScaffoldProjectContent.run project: @project,
                                            configuration: params.to_unsafe_h.dig(:data, :attributes, :configuration)
        render_single_resource @project
      end

      def update
        @project = load_and_authorize_project
        ::Updaters::Project.new(project_params).update(@project)
        render_single_resource @project,
                               include: includes
      end

      def destroy
        @project = load_and_authorize_project
        @project.async_destroy
      end

      protected

      def includes
        [:creators, :contributors, :texts, :text_categories, :events,
         :resource_collections, :resources, :subjects,
         :permitted_users, :content_blocks, :action_callouts, :journal,
         :journal_volume, :journal_issue, :flattened_collaborators, :collaborators]
      end

      def scope_for_projects
        Project.existing.friendly
      end

      def scope_visibility
        # The default scope is to return all projects that can be read by the current
        # user, which as of now includes all projects except for drafts. If
        # the API is asked to return projects that can be updated by the current user
        # (such as for a backend dashboard), we do not apply the read check. We could
        # apply both the read and update scopes, but then we have to join roles on both
        # which I suspect is less efficient. Note that the with_update_ability is applied
        # automatically through the filterable concern. -ZD
        return Project.existing.with_read_ability current_user unless project_filter_params&.dig(:with_update_ability)

        Project.existing.all
      end

      private

      def project_params
        params.require(:data)
        attributes = [:title, :subtitle, :featured, :hashtag, :description, :purchase_url,
                      :purchase_price_currency, :facebook_id, :purchase_call_to_action, :twitter_id,
                      :hide_activity, :instagram_id, :remove_avatar, attachment(:avatar),
                      attachment(:hero), :download_url, attachment(:cover), :remove_hero, :draft,
                      :remove_cover, :download_call_to_action, :publication_date, metadata(Project),
                      :avatar_color, { tag_list: [] }, :dark_mode, :image_credits,
                      :standalone_mode, :standalone_mode_press_bar_text, :restricted_access,
                      :standalone_mode_press_bar_url, :finished, :restricted_access_heading,
                      :restricted_access_body, :open_access, :disable_engagement,
                      :journal_issue_pending_sort_title, :journal_issue_number, :pending_slug,
                      :social_title, attachment(:social_image), :remove_social_image,
                      :social_description, :external_identifier]
        relationships = [:collaborators, :creators, :contributors, :subjects, :journal_volume]
        param_config = structure_params(attributes: attributes, relationships: relationships)
        params.permit(param_config)
      end
    end
  end
end
