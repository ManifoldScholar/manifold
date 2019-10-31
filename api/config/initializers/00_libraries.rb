require "redcarpet/compat"
require "uber/inheritable_attr"
require "to_week_range"
require "auth_token"
require "middleware/omniauth_stack"
require "our_types/indifferent_hash"
require "scanf"
require "zip"

require "dry/monads"
require "dry/system/container"
require "dry/transaction/operation"

Dry::Types.load_extensions(:monads)

module ResultAttrPatch
  def visit_attr(node)
    attr_name, inner_node = node

    "attr(##{attr_name}, #{visit(inner_node)})"
  end
end

Dry::Logic::Result.prepend ResultAttrPatch

ActiveRecord::Type.register :indifferent_hash, OurTypes::IndifferentHash
