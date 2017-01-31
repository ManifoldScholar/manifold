# Model concern that includes relations to collaborators and scoped relations to creators
# and contributors
module Collaborative
  extend ActiveSupport::Concern

  # rubocop:disable Metrics/BlockLength
  included do
    has_many :collaborators,
             -> { order(:position) },
             as: :collaboratable

    # "If you use a hash-style where option, then record creation via this association
    # will be automatically scoped using the hash." -- Love, Rails
    has_many :creator_collaborators,
             -> { where(role: Collaborator::ROLE_CREATOR).order(:position) },
             as: :collaboratable,
             class_name: "Collaborator"
    has_many :contributor_collaborators,
             -> { where(role: Collaborator::ROLE_CONTRIBUTOR).order(:position) },
             as: :collaboratable,
             class_name: "Collaborator"

    has_many :makers, through: :collaborators
    has_many :creators,
             through: :creator_collaborators,
             source: "maker" do
      def sort(makers)
        makers.each_with_index do |maker, index|
          role = Collaborator::ROLE_CREATOR
          # rubocop:disable Rails/SkipsModelValidations
          @association.owner
                      .collaborators
                      .find_by(maker: maker, role: role)
                      .update_attribute(:position, index + 1)
          # rubocop:enable Rails/SkipsModelValidations
        end
      end
    end

    has_many :contributors,
             through: :contributor_collaborators,
             source: "maker" do
               def sort(makers)
                 makers.each_with_index do |maker, index|
                   role = Collaborator::ROLE_CONTRIBUTOR
                   # rubocop:disable Rails/SkipsModelValidations
                   @association.owner
                               .collaborators
                               .find_by(maker: maker, role: role)
                               .update_attribute(:position, index + 1)
                   # rubocop:enable Rails/SkipsModelValidations
                 end
               end
             end
  end
  # rubocop:enable Metrics/BlockLength

  def creator_names
    creators
      .pluck(:first_name, :last_name)
      .map { |parts| "#{parts[0]} #{parts[1]}" }
      .join(", ")
  end
end
