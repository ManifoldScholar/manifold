module ResourceImportRows
  class StateMachine
    include Statesman::Machine

    state :new, initial: true
    state :pending
    state :queued
    state :importing
    state :imported
    state :failed
    state :skipped

    transition from: :new, to: [:pending, :queued, :importing]
    transition from: :pending, to: [:queued, :importing]
    transition from: :queued, to: [:pending, :importing, :skipped]
    transition from: :importing, to: [:imported, :failed]
    transition from: :imported, to: [:pending]
    transition from: :failed, to: [:pending]

    # The row needs to have be valid and saved before it can be processed.
    guard_transition(to: :queued) do |row|
      row.valid? && !row.new_record?
    end

    # Clear import errors and reset the resource when the row is pending.
    after_transition(to: :pending, after_commit: true) do |row|
      row.import_errors = []
      row.set_resource
      row.save!
    end

    # Once the row is queued, kick off the import job (usually in the BG).
    # When the import job starts, it will transition the row to an importing state
    after_transition(to: :queued, after_commit: true) do |row, transition|
      next row.state_machine.transition_to!(:skipped) if row.skip?

      if transition.metadata["perform_now"] == true
        ResourceImportRows::ImportJob.perform_now(row.id)
      else
        ResourceImportRows::ImportJob.perform_later(row.id)
      end
      true
    end

    # After the row enters the importing state, we do the actual import, which is handled
    # in the row import interaction.
    after_transition(to: :importing, after_commit: true) do |row|
      outcome = ResourceImportRows::Import.run(row: row)
      # Retry network errors once.
      outcome = ResourceImportRows::Import.run(row: row) if outcome.errors.include? :network
      if outcome.valid?
        row.resource = outcome.result[:resource]
        row.state_machine.transition_to!(:imported)
        row.save
        next outcome
      end
      row.import_errors = outcome.errors[:base].to_a
      row.state_machine.transition_to!(:failed)
      row.save
      outcome
    end

    # Import ends with a row that is imported or failed. Once this happens, we tell the
    # parent resource_import to transition to the completed "imported" state. There are
    # guards in the resource import state machine that prevent this from happening before
    # all the rows have been imported.
    after_transition(to: [:imported, :failed], after_commit: true) do |row|
      row.resource_import.state_machine.transition_to(:imported)
    end

  end
end
