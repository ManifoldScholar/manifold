module Analytics
  class FetchVisit < ActiveInteraction::Base

    string :visit_token
    string :visitor_token

    object :request, class: ActionDispatch::Request

    def execute
      existing_visit || track_new_visit
    end

    private

    def existing_visit
      @visit ||= Analytics::Visit.find_by(visit_token: visit_token)
    end

    def track_new_visit
      tracker.track_visit(started_at: Time.current)
      @visit = tracker.visit
    end

    def tracker
      @tracker ||= Ahoy::Tracker.new(**tracker_args)
    end

    def tracker_args
      {visit_token: visit_token, visitor_token: visitor_token, request: request}.compact
    end

  end
end
