module Packaging
  module BagItSpec
    module BuildsEntries
      extend ActiveSupport::Concern

      included do
        include Packaging::BagItSpec::Import[entry_builder: "entries.builder"]

        memoize :entries
      end

      # @yield [entry]
      # @yieldparam [Packaging::BagItSpec::Entries::Base] entry
      # @yieldreturn [void]
      # @return [self]
      def each_entry
        return enum_for(__method__) unless block_given?

        entries.each_value do |entry|
          yield entry
        end

        return self
      end

      # @!attribute [r] entries
      # @return [<Packaging::BagItSpec::Entries::Base>]
      def entries
        entry_builder.call self do |builder|
          build_entries builder
        end
      end

      # @api private
      # @abstract
      # @param [Packaging::BagItSpec::Entries::Builder] builder
      # @return [void]
      # rubocop:disable Lint/UnusedMethodArgument
      def build_entries(builder)
        # :nocov:
        raise NotImplementedError, "Must implement #{self.class}##{__method__}"
        # :nocov:
      end
      # rubocop:enable Lint/UnusedMethodArgument
    end
  end
end
