module Packaging
  module BagItSpec
    # BagIt spec packaging services and operations.
    #
    # @api private
    # rubocop:disable Layout/AlignArguments, Layout/AlignParameters
    class Container
      include Concerns::IntrospectiveContainer

      register_simple_callables_in :compilation,
        :add_resources,
        :add_texts,
        :build_archive,
        :build_manifest,
        :finalize,
        :pipeline,
        :prepare,
        :prepare_resource,
        :prepare_text,
        :write_project_entries

      namespace :compilation do
        register "version", memoize: true do
          Packaging::BagItSpec::Compilation::VERSION
        end
      end

      register_simple_callables_in :entries,
        :builder

      namespace :manifold do
        register "version", memoize: true do
          Settings.manifold_version
        end
      end

      register_simple_callables_in :resources,
        :attachment_name_parser
    end
    # rubocop:enable Layout/AlignArguments, Layout/AlignParameters
  end
end
