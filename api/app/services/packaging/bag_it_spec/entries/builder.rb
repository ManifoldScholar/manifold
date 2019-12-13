module Packaging
  module BagItSpec
    module Entries
      # A callable object to build an arbitrary list of entries
      # for proxies in the {Packaging::BagItSpec} namespace.
      #
      # @see Packaging::BagItSpec::BuildsEntries
      class Builder
        # @param [Packaging::BagItSpec::BuildsEntries] proxy
        # @return [<Packaging::BagItSpec::Entries::Base>]
        def call(proxy)
          reset_entries!

          @proxy = proxy

          yield self if block_given?

          return @entries
        ensure
          reset_entries!

          @proxy = nil
        end

        # @param [String] identifier
        # @param [Pathname, String] target_path
        # @param [#as_json] json_content
        # @return [void]
        def json!(identifier, target_path, json_content)
          add_entry! "JSON", identifier, target_path, json_content
        end

        # @param [String] identifier
        # @param [Pathname, String] target_path
        # @param [Pathname, String] source_path
        # @return [void]
        def local_path!(identifier, target_path, source_path)
          add_entry! "LocalPath", identifier, target_path, source_path
        end

        alias local! local_path!

        # @param [String] identifier
        # @param [Pathname, String] target_path
        # @param [String, #to_s] content
        # @param [{ Symbol => Object }] options
        # @return [void]
        def simple!(identifier, target_path, content, **options)
          add_entry! "Simple", identifier, target_path, content, options
        end

        private

        def add_entry!(klass_name, *args, **options)
          klass = "Packaging::BagItSpec::Entries::#{klass_name}".constantize

          @entries << klass.new(*args, **options)
        end

        def reset_entries!
          @entries = Utility::IndexMap.new :identifier, Packaging::BagItSpec::Entries::EntryType
        end
      end
    end
  end
end
