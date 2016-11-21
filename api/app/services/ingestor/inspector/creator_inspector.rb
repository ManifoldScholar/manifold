module Ingestor
  module Inspector
    # Abstract class for creator inspectors
    class CreatorInspector

      def name
        raise NotImplementedError, "Title Inspector should implement 'name'"
      end

      def sort_name
        raise NotImplementedError, "Title Inspector should implement 'sort_name'"
      end

      def role
        Collaborator::ROLE_CREATOR
      end

    end
  end
end
