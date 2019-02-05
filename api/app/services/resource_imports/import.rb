module ResourceImports
  class Import < ActiveInteraction::Base
    record :resource_import
    boolean :perform_now, default: false

    def execute
      return complete_import if resource_import.data_rows.count.zero?

      queue_rows
      resource_import.save!
    end

    private

    def queue_rows
      resource_import.data_rows.each do |row|
        row.state_machine.transition_to(:queued, perform_now: perform_now)
      end
    end

    def complete_import
      resource_import.state_machine.transition_to(:imported)
    end
  end
end
