module Content
  class HeroBlock < ::ContentBlock
    include Concerns::HasFormattedAttributes

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
