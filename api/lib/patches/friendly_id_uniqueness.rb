module Patches
  module FriendlyIdUniqueness
    def unset_slug_if_invalid; end
  end
end

FriendlyId::Slugged.prepend Patches::FriendlyIdUniqueness
