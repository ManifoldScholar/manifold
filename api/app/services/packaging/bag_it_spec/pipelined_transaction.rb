module Packaging
  module BagItSpec
    # Shared module that defines transactional pipelines that depend
    # on {Packaging::BagItSpec::Container our service container}
    # and {Packaging::Shared::StepAdapters our custom step adapters}.
    PipelinedTransaction = Dry::Transaction(
      container: Packaging::BagItSpec::Container,
      step_adapters: Packaging::Shared::StepAdapters
    )
  end
end
