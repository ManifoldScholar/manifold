module Packaging
  module EpubV3
    module TextCompilation
      # Extract {Collaborator collaborators} from a {Text}, accounting for {CollaboratorRole their role},
      # transforming them into {Packaging::EpubV3::CollaboratorItem a resource proxy}, and adding them
      # to the state.
      class ExtractCollaborators
        include Dry::Transaction::Operation

        # @param [Hash] state
        # @option state [Text] :text
        # @return [void]
        def call(state)
          state[:collaborators] = []

          state[:text].collaborators.includes(:maker).group_by(&:role).each do |kind, collaborators|
            item_state = { kind: CollaboratorRole[kind] }

            collaborators.each_with_index do |collaborator, index|
              item = Packaging::EpubV3::CollaboratorItem.new(
                item_state.merge(
                  collaborator: collaborator,
                  display_seq: index + 1,
                  maker: collaborator.maker
                )
              )

              state[:collaborators] << item
            end
          end
        end
      end
    end
  end
end
