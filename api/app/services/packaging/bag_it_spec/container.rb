module Packaging
  module BagItSpec
    # EpubV3 packaging services and operations.
    #
    # @api private
    # rubocop:disable Layout/AlignArguments, Layout/AlignParameters
    class Container
      include Concerns::IntrospectiveContainer

      register_simple_callables_in :compilation,
        :add_texts,
        :build_archive,
        :build_manifest,
        :finalize,
        :pipeline,
        :prepare,
        :prepare_text,
        :write_metadata
    end
    # rubocop:enable Layout/AlignArguments, Layout/AlignParameters
  end
end
