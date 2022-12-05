# frozen_string_literal: true

module EntitlementImportRows
  class Process
    include Dry::Effects.Resolve(:import)
    include Dry::Effects.Resolve(:subscription)
    include Dry::Effects.State(:line_number)
    include Dry::Monads[:do, :result]
    include EntitlementImports::WritesMessages
    include ManifoldApi::Deps[
      capture_logs: "entitlement_imports.capture_logs",
      create_entitlement: "entitlement_import_rows.create_entitlement",
      validate: "entitlement_import_rows.contract"
    ]

    # @param [CSV::Row] csv_row
    # @return [Dry::Monads::Success(EntitlementImportRow)]
    def call(csv_row)
      self.line_number += 1

      result = validate.(csv_row.to_h)

      row = import.entitlement_import_rows.create! line_number: line_number

      capture_logs.(row) do
        yield handle!(row, result)
      end

      create_entitlement.(row)
    end

    private

    def handle!(row, result)
      if result.success?
        handle_success!(row, result)
      else
        handle_failure!(row, result)
      end
    end

    def handle_success!(row, result)
      attrs = yield load_attributes! result

      row.update!(**attrs)

      Success row
    end

    def load_attributes!(result)
      attrs = result.to_h.transform_values do |value|
        case value
        when ::GlobalID then value.find
        else
          value
        end
      end
    rescue ActiveRecord::RecordNotFound
      # :nocov:
      Failure[:not_found]
      # :nocov:
    else
      yield maybe_load_email!(attrs)

      yield maybe_remap_subject!(attrs)

      Success attrs
    end

    def handle_failure!(row, result)
      messages = result.errors(full: true).messages.map(&:to_s)

      messages.each do |message|
        log! "Error: #{message}"
      end

      row.transition_to! :failure

      Failure[:invalid]
    end

    def maybe_load_email!(attrs)
      if attrs[:email].present? && attrs[:target].blank?
        user = User.where(email: attrs[:email]).first

        if user.present?
          attrs[:target] = user

          log! "Found user #{user.id} for #{attrs[:email]}"
        end
      end

      Success()
    end

    def maybe_remap_subject!(attrs)
      if attrs[:subject] == "subscriber"
        log! "Got a subscriber"

        attrs[:subject] = subscription
      end

      Success()
    end
  end
end
