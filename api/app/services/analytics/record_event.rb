module Analytics
  class RecordEvent < ActiveInteraction::Base

    record :analytics_visit, class: Analytics::Visit

    string :visit_token, default: nil

    set_callback :type_check, :before, :set_visit

    def execute
    end

    private

    def set_visit
      return if analytics_visit.present?
      return if visit_token.blank?

      @analytics_visit = Analytics::Visit.find_by(visit_token: visit_token) ||
                          Analytics::RecordVisit.run(visit_token: visit_token).result
    end

  end
end
