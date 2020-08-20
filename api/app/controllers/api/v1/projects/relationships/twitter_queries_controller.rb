module API
  module V1
    module Projects
      module Relationships
        # Responds with twitter queries in a project
        class TwitterQueriesController < AbstractProjectChildController

          resourceful! TwitterQuery, authorize_options: {
            except: [:index, :create, :show, :update, :destroy]
          } do
            @project.nil? ? TwitterQuery : @project.twitter_queries
          end

          def index
            authorize_action_for TwitterQuery, for: @project
            @twitter_queries = load_twitter_queries
            location = api_v1_project_relationships_twitter_queries_url(@project.id)
            render_multiple_resources(
              @twitter_queries,
              location: location
            )
          end

          def create
            @twitter_query =
              ::Updaters::Default.new(twitter_query_params)
                .update_without_save(@project.twitter_queries.new)
            @twitter_query.creator = @current_user
            authorize_action_for @twitter_query
            @twitter_query.save
            render_single_resource(
              @twitter_query,
              location: location
            )
          end

          def show
            @twitter_query = load_twitter_query
            authorize_action_for @twitter_query
            render_single_resource(
              @twitter_query,
              location: location
            )
          end

          def update
            @twitter_query = load_and_authorize_twitter_query
            ::Updaters::Default.new(twitter_query_params).update(@twitter_query)
            render_single_resource(
              @twitter_query,
              location: location
            )
          end

          def destroy
            @twitter_query = load_and_authorize_twitter_query
            @twitter_query.destroy
          end

          private

          def location
            api_v1_project_relationships_twitter_queries_url(
              @twitter_query,
              project_id: @twitter_query.project_id
            )
          end

        end
      end
    end
  end
end
