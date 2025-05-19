module API
  module V1
    module Resources
      module Relationships
        class TextTracksController < ApplicationController
          before_action :set_resource

          resourceful! TextTrack, authorize_options: { except: [:index, :show] } do
            @resource.text_tracks
          end

          def index
            @text_tracks = load_text_tracks
            render_multiple_resources(@text_tracks)
          end

          def show
            @text_track = load_text_track
            render_single_resource @text_track
          end

          def create
            @text_track = Updaters::TextTrack
              .new(text_track_params)
              .update_without_save(@resource.text_tracks.new)
            authorize_action_for @text_track
            @text_track.save
            render_single_resource(@text_track)
          end

          def update
            @text_track = load_and_authorize_text_track
            Updaters::TextTrack.new(text_track_params).update(@text_track)
            render_single_resource(@text_track)
          end

          def destroy
            @text_track = load_and_authorize_text_track
            @text_track.destroy
          end

          private

          def set_resource
            @resource = Resource.find(params[:resource_id])
          end
        end
      end
    end
  end
end
