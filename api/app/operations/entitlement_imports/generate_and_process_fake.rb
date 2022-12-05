# frozen_string_literal: true

module EntitlementImports
  class GenerateAndProcessFake
    include Dry::Monads[:result, :do]
    include ManifoldApi::Deps[
      generate_fake: "entitlement_imports.generate_fake",
      process: "entitlement_imports.process",
    ]

    def call
      import = yield generate_import

      yield process.(import)

      Success import
    end

    private

    # @return [Dry::Monads::Success(EntitlementImport)]
    def generate_import
      path = yield generate_fake.call

      import = EntitlementImport.new(creator: User.cli_user)

      import.file = path.open("r+")

      import.save!

      Success import
    end
  end
end
