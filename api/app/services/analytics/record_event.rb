module Analytics
  class RecordEvent < ActiveInteraction::Base

    VIEW_EVENT_MATCHER = "view resource".freeze
    SEARCH_EVENT_MATCHER = "search".freeze
    LEAVE_EVENT_MATCHER = "leave"

    record :analytics_visit, class: Analytics::Visit

    string :visit_token, default: nil
    string :visitor_token, default: nil

    object :request, class: ActionDispatch::Request, default: nil

    set_callback :type_check, :before, :set_visit

    class << self
      def record_event(inputs)
        interaction = case inputs[:name]
                      when VIEW_EVENT_MATCHER
                        Analytics::RecordViewEvent
                      when SEARCH_EVENT_MATCHER
                        Analytics::RecordSearchEvent
                      when LEAVE_EVENT_MATCHER
                        Analytics::RecordLeaveEvent
                      else
                        Analytics::RecordCustomEvent
                      end

        interaction.run inputs
      end
    end

    private

    def set_visit
      return if analytics_visit.present? || request.blank?

      get_tokens_from_headers if visit_token.blank?
      return if visit_token.blank?

      @analytics_visit = Analytics::FetchVisit.run!(visit_token: visit_token, visitor_token: visitor_token, request: request)
    end

    def get_tokens_from_headers
      # rubocop:disable Naming/MemoizedInstanceVariableName
      @visit_token ||= request.headers["HTTP_VISIT_TOKEN"]
      @visitor_token ||= request.headers["HTTP_VISITOR_TOKEN"]
      # rubocop:enable Naming/MemoizedInstanceVariableName
    end

  end
end
