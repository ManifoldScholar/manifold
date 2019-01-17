module Content
  class HeroBlock < ::ContentBlock
    include Concerns::HasFormattedAttributes

    has_configured_attributes title: :string # Temporary for POC

    class << self
      def orderable?
        false
      end

      def hideable?
        false
      end
    end
  end
end
