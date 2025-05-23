# frozen_string_literal: true

module Packaging
  module BagItSpec
    # BagIt spec packaging services and operations.
    #
    # @api private
    class Container
      include IntrospectiveContainer

      import ::Shared::PipelineUtilities

      register_simple_callables_in :compilation,
                                   :add_resources,
                                   :add_texts,
                                   :build_archive,
                                   :build_manifest,
                                   :finalize,
                                   :generate_bag_info,
                                   :pipeline,
                                   :prepare,
                                   :prepare_resource,
                                   :prepare_resources,
                                   :prepare_text,
                                   :prepare_texts,
                                   :write_bag_info,
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
  end
end
