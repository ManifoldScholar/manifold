module Ingestions
  module Compilers
    class Contributor < Ingestions::Compilers::Maker

      private

      def collaborator_attributes
        {
          role: Collaborator::ROLE_CONTRIBUTOR
        }
      end
    end
  end
end
