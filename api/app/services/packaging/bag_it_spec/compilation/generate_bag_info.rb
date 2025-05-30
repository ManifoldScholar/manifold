# frozen_string_literal: true

module Packaging
  module BagItSpec
    module Compilation
      # Generate BagIt spec headers for its info file.
      class GenerateBagInfo
        include Packaging::PipelineOperation
        include Packaging::BagItSpec::Import[compilation_version: "compilation.version", manifold_version: "manifold.version"]

        def call(*)
          state[:bag_info] = generate

          Success()
        end

        private

        # @param [Pathname] build_path
        # @param [Packaging::BagItSpec::Context] context
        # @param [Hash] state
        # @return [{ String => String }]
        def generate
          state => { build_path:, context:, }

          project = context.project

          start!

          # set! "Source-Organization", "TBI"
          # set! "Organization-Address", "TBI"
          # set! "Contact-Name", "TBI"
          # set! "Contact-Phone', "TBI"
          # set! "Contact-Email", "TBI"
          set! "Bag-Size", human_readable_size_for(build_path)
          set! "External-Identifier", context.global_id
          set! "Internal-Sender-Description", project.description
          set! "Internal-Sender-Identifier", context.global_id

          # Manifold-specific Custom Headers
          set! "Manifold-Reader-URL", context.reader_url
          set! "Manifold-BagIt-Version", compilation_version
          set! "Manifold-Version", manifold_version
        ensure
          reset!
        end

        # @return [void]
        def start!
          @info = {}
        end

        # @param [String] header
        # @param [#to_s] value
        # @return [Hash]
        def set!(header, value)
          @info[header] = value.to_s

          return @info
        end

        def reset!
          @info = nil
        end

        # @param [Pathname] path
        # @return [String]
        def human_readable_size_for(path)
          size = Utility::CalculateDirectorySize.run! path: path

          ActiveSupport::NumberHelper.number_to_human_size size
        end
      end
    end
  end
end
