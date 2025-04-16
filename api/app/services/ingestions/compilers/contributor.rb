module Ingestions
  module Compilers
    class Contributor < Ingestions::Compilers::Maker
      private

      def collaborator_attributes
        {
          role: CollaboratorRole::Contributor
        }
      end
    end
  end
end
