require "redcarpet/compat"
require "uber/inheritable_attr"
require "to_week_range"
require "auth_token"
require "middleware/omniauth_stack"
require "our_types/indifferent_hash"

ActiveRecord::Type.register :indifferent_hash, OurTypes::IndifferentHash
