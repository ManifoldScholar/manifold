module Updaters
  module V2
    class Events < Updaters::AbstractUpdater
      with_options default: nil do
        string :event_type
        string :event_url
        string :subject_type
        string :subject_title
        string :subject_subtitle
        string :attribution_name
        string :attribution_url
        string :attribution_identifier
        string :event_title
        string :event_subtitle
        string :external_subject_id
        string :external_subject_type
        string :excerpt

        record :subject
        record :project
        record :twitter_query
      end

      # table => subjects
      validates :subject, presence: true
      validates :project, presence: true
      # table => twitter_queries
      validates :twitter_query, presence: true
    end
  end
end
