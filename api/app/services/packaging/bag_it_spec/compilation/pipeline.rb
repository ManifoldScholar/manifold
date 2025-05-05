# frozen_string_literal: true

module Packaging
  module BagItSpec
    module Compilation
      # This pipeline will compile a {Project} into a BagIt spec archive.
      class Pipeline
        include Packaging::BagItSpec::PipelinedTransaction

        around :provide_state!, with: "utilities.provide_state"

        step :prepare!, with: "compilation.prepare"

        step :prepare_texts!, with: "compilation.prepare_texts"

        step :prepare_resources!, with: "compilation.prepare_resources"

        step :add_texts!, with: "compilation.add_texts"

        step :add_resources!, with: "compilation.add_resources"

        step :write_project_entries!, with: "compilation.write_project_entries"

        step :generate_bag_info!, with: "compilation.generate_bag_info"

        step :write_bag_info!, with: "compilation.write_bag_info"

        step :build_manifest!, with: "compilation.build_manifest"

        step :build_archive!, with: "compilation.build_archive"

        step :finalize!, with: "compilation.finalize"
      end
    end
  end
end
