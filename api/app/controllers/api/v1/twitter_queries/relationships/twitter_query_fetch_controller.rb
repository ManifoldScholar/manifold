module API
  module V1
    module TwitterQueries
      module Relationships
        class TwitterQueryFetchController < ApplicationController

          resourceful! TwitterQuery

          def create
            @twitter_query = TwitterQuery.find(params[:twitter_query_id])
            @twitter_query.fetch_now
            render_single_resource(
              @twitter_query,
              location: location
            )
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
