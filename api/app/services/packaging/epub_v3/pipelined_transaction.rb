module Packaging
  module EpubV3
    # Shared module that defines transactional pipelines that depend
    # on {Packaging::EpubV3::Container our service container}
    # and {Packaging::Shared::StepAdapters our custom step adapters}.
    PipelinedTransaction = Dry::Transaction(
      container: Packaging::EpubV3::Container,
      step_adapters: Packaging::Shared::StepAdapters
    )
  end
end
