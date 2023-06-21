module Analytics
  class FetchVisit < ActiveInteraction::Base

    with_options default: nil do
      string :visit_token
      string :visitor_token
    end

    object :request, class: ActionDispatch::Request

    def execute
      visit || track_new_visit
    end

    private

    def valid_visit_token
      @valid_visit_token ||= visit_token || request.headers["HTTP_VISIT_TOKEN"]
    end

    def valid_visitor_token
      @valid_visitor_token ||= visitor_token || request.headers["HTTP_VISITOR_TOKEN"]
    end

    def visit
      @visit ||= Analytics::Visit.find_by(visit_token: valid_visit_token)
    end

    def track_new_visit
      tracker.track_visit(started_at: Time.current)
      @visit = tracker.visit
    end

    def tracker
      @tracker ||= Ahoy::Tracker.new(**tracker_args)
    end

    def tracker_args
      {
        visit_token: valid_visit_token,
        visitor_token: valid_visitor_token,
        request: request
      }.compact
    end

  end
end
