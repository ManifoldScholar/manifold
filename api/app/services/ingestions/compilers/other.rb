module Ingestions
  module Compilers
    class Other < Ingestions::Compilers::Maker
      private

      def collaborator_attributes
        {
          role: CollaboratorRole::Other
        }
      end
    end
  end
end
