module ResourceImports
  class StateMachine
    include Statesman::Machine

    COMPLETE_STATES = %I{imported failed skipped}.freeze

    state :pending, initial: true
    state :parsing
    state :parsed
    state :mapped
    state :importing
    state :imported

    transition from: :pending, to: [:parsing]
    transition from: :parsing, to: [:pending, :parsed]
    transition from: :parsed, to: [:parsing, :mapped, :importing]
    transition from: :mapped, to: [:importing, :pending, :parsing, :parsed]
    transition from: :importing, to: [:imported, :pending, :parsed, :mapped]
    transition from: :imported, to: [:pending, :parsed, :mapped]

    # We won't parse an import that isn't valid and hasn't yet been saved. This ensures
    # that we're not checking for the presence of requisite fields while we parse it.
    guard_transition(to: :parsed) do |resource_import|
      resource_import.valid? && !resource_import.new_record?
    end

    # We can't import unless the title is present in the source data, since it's needed
    # for all resources.
    guard_transition(to: :importing) do |resource_import|
      resource_import.title_mapped?
    end

    # An import isn't considered "imported" unless all its rows have either been imported
    # or have failed for some reason.
    guard_transition(to: :imported) do |resource_import|
      count = resource_import
        .data_rows
        .not_in_state(COMPLETE_STATES)
        .count
      count.zero?
    end

    # Reset the import before setting it to pending
    before_transition(to: :pending) do |resource_import|
      resource_import.reset
    end

    # Reset the import before setting it to parsing
    before_transition(to: :parsing) do |resource_import|
      resource_import.parse_error = false
      resource_import.reset
    end

    # After the import transitions to mapped, we save it and set each row to pending.
    # Once the import is mapped, we can determing the fingerprint of each row and assign
    # it a resource, which is what happens in the row pending transition.
    after_transition(to: :mapped, after_commit: true) do |resource_import|
      resource_import.save!
      resource_import.resource_import_rows.with_type_data.each do |row|
        row.state_machine.transition_to(:pending)
      end
    end

    # After the import transitions to parsing, we run the parse interaction, which creates
    # the row models
    after_transition(to: :parsing) do |resource_import|
      outcome = ResourceImports::Parse.run(resource_import: resource_import)
      if outcome.errors.empty?
        resource_import.state_machine.transition_to(:parsed)
      else
        outcome.errors.each do |_attribute, error|
          resource_import.errors.add(:parsing, error)
        end
        resource_import.state_machine.transition_to(:pending)
      end
    end

    # Transitioning to importing will run the actual import, which triggers an import
    # transition for each row.
    after_transition(to: :importing) do |resource_import, transition|
      now = transition.metadata["perform_now"] == true
      ResourceImports::Import.run(resource_import: resource_import, perform_now: now)
    end

    # If an import reverts from an imported state to an earlier state, all of its rows are
    # set back to pending.
    after_transition(from: :imported) do |resource_import|
      resource_import.resource_import_rows.each do |row|
        row.state_machine.transition_to :pending
      end
    end

  end
end
# rubocop:enable
#
