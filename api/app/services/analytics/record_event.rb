module Analytics
  class RecordEvent < ActiveInteraction::Base

    VIEW_EVENT_MATCHER = "view resource".freeze
    SEARCH_EVENT_MATCHER = "search resource".freeze
    SHARE_EVENT_MATCHER = "share".freeze
    CITE_EVENT_MATCHER = "cite".freeze
    LEAVE_EVENT_MATCHER = "leave".freeze

    record :analytics_visit, class: Analytics::Visit
    string :visit_token, default: nil
    string :visitor_token, default: nil
    object :request, class: ActionDispatch::Request, default: nil

    class << self
      def record_event(inputs)
        interaction = case inputs[:name]
                      when VIEW_EVENT_MATCHER
                        Analytics::RecordViewEvent
                      when SEARCH_EVENT_MATCHER
                        Analytics::RecordSearchEvent
                      when LEAVE_EVENT_MATCHER
                        Analytics::RecordLeaveEvent
                      when SHARE_EVENT_MATCHER, CITE_EVENT_MATCHER
                        inputs[:name] = Analytics::Event.event_name_for(inputs[:name], TextSection)
                        Analytics::RecordCustomEvent
                      else
                        Analytics::RecordCustomEvent
                      end

        interaction.run inputs
      end
    end

    private

    def set_valid_analytics_visit
      return analytics_visit if analytics_visit.present? || request.blank?
      return analytics_visit if valid_visit_token.blank?

      Analytics::FetchVisit.run!(visit_token: valid_visit_token, visitor_token: valid_visitor_token, request: request)
    end

    def valid_analytics_visit
      @valid_analytics_visit ||= set_valid_analytics_visit
    end

    def valid_visit_token
      @valid_visit_token ||= visit_token || request.headers["HTTP_VISIT_TOKEN"]
    end

    def valid_visitor_token
      @valid_visitor_token ||= valid_visitor_token || request.headers["HTTP_VISITOR_TOKEN"]
    end

  end
end
