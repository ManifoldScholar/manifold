# frozen_string_literal: true

require "redcarpet/compat"
require "image_processing/mini_magick"
require "uber/inheritable_attr"
require "to_week_range"
require "auth_token"
require "middleware/omniauth_stack"
require "our_types/indifferent_hash"
require "scanf"
require "zip"

require "dry/core"
require "dry/effects"
require "dry/monads"
require "dry/monads/do"
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

Dry::Validation.load_extensions :predicates_as_macros

ActiveRecord::Type.register :indifferent_hash, OurTypes::IndifferentHash

PaperTrail::Version.include ::PaperTrailGlobalid::VersionConcern
