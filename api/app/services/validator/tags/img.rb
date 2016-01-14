module Validator
  module Tags
    # This class is a placeholder to demonstrate how we can intervene in the validation of
    # a single HTML node and modify it in place during HTML validation. Currently, it does
    # nothing except show the interface.
    class Img
      def validate_node!(_node)
        # We could do something to the node here.
      end
    end
  end
end
