module Analytics
  class FetchVisit < ActiveInteraction::Base

    string :visit_token
    string :visitor_token

    object :request, class: ActionDispatch::Request

    set_callback :type_check, :before, :extract_tokens

    def execute
      visit || track_new_visit
    end

    private

    def extract_tokens
      # rubocop:disable Naming/MemoizedInstanceVariableName
      @visit_token ||= request.headers["HTTP_VISIT_TOKEN"]
      @visitor_token ||= request.headers["HTTP_VISITOR_TOKEN"]
      # rubocop:enable Naming/MemoizedInstanceVariableName
    end

    def visit
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
      {
        visit_token: visit_token,
        visitor_token: visitor_token,
        request: request
      }.compact
    end

  end
end
