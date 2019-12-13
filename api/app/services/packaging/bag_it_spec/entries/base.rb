module Packaging
  module BagItSpec
    module Entries
      # @abstract
      class Base
        extend Dry::Initializer
        extend Memoist

        param :identifier, Types::Coercible::String
        param :target_path, Types::PATH

        option :skip_blank, Types::Bool, default: proc { true }

        # @abstract
        # @param [BagIt::Bag] bag
        # @return [void]
        # rubocop:disable Lint/UnusedMethodArgument
        def add_to!(bag)
          # :nocov:
          raise NotImplementedError, "must implement #{self.class}##{__method__}"
          # :nocov:
        end
        # rubocop:enable Lint/UnusedMethodArgument
      end
    end
  end
end
