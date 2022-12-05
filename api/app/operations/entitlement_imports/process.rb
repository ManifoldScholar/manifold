# frozen_string_literal: true

module EntitlementImports
  class Process
    include Dry::Effects::Handler.Resolve
    include Dry::Effects::Handler.State(:line_number)
    include Dry::Effects.State(:line_number)
    include Dry::Monads[:result, :validated, :do]
    include ManifoldApi::Deps[
      process_row: "entitlement_import_rows.process",
    ]

    prepend EntitlementImports::WithMessages

    # @param [EntitlementImport] import
    # @return [Dry::Monads::Result]
    def call(import)
      log! "Started processing"

      subscription = SystemEntitlement.fetch :subscription

      entitler = import.to_upsertable_entitler

      entitler.save! if entitler.new_record?

      provide(entitler: entitler, import: import, subscription: subscription) do
        parse import
      end
    end

    private

    def parse(import)
      import.file.download do |f|
        with_line_number(1) do
          CSV.foreach(f, headers: true) do |row|
            process_row! row
          end
        end
      end
    rescue StandardError => e
      log! "Problem processing: #{e.message}"

      import.transition_to! :failure if import.can_transition_to?(:failure)

      Success()
    else
      import.transition_to! :success

      Success()
    end

    def process_row!(row)
      result = process_row.(row)

      Dry::Matcher::ResultMatcher.(result) do |m|
        m.success do
          log! "[Line #{line_number}] processed"
        end

        m.failure :no_target_yet do |_, email|
          log! "[Line #{line_number}] is waiting for a user with email #{email.inspect}"
        end

        m.failure do
          log! "[Line #{line_number}] failed to process"
        end
      end
    end
  end
end
