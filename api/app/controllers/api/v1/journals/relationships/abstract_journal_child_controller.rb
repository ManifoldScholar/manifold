module API
  module V1
    module Journals
      module Relationships
        class AbstractJournalChildController < ApplicationController

          before_action :set_journal
          before_action :authorize_journal

          private

          def authorize_journal
            return unless has_journal?
            return if @journal.fully_readable_by?(current_user)

            violation = ::Authority::SecurityViolation.new(authority_user, action_name, @journal)
            authority_forbidden_resource_instance(violation)
          end

          def has_journal?
            params.key? :journal_id
          end

          def set_journal
            id = params[:journal_id]
            @journal = Journal.friendly.find(id) if id
          end

        end
      end
    end
  end
end
