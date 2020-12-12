module Analytics
  class RecordEvent < ActiveInteraction::Base

    record :analytics_visit, class: Analytics::Visit

    string :visit_token, default: nil
    string :visitor_token, default: nil

    object :request, class: ActionDispatch::Request, default: nil

    set_callback :type_check, :before, :set_visit

    def execute; end

    private

    def set_visit
      return if analytics_visit.present? || request.blank?

      get_tokens

      return if visit_token.blank?

      @analytics_visit = Analytics::FetchVisit.run!(visit_token: visit_token, visitor_token: visitor_token, request: request)
    end

    def get_tokens
      @visit_token ||= request.headers["HTTP_VISIT_TOKEN"]
      @visitor_token ||= request.headers["HTTP_VISITOR_TOKEN"]
    end

  end
end
