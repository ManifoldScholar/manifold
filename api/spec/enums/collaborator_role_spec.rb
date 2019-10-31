require "rails_helper"

RSpec.describe CollaboratorRole, packaging: true, type: :enum do
  subject { described_class.new }

  describe CollaboratorRole::Creator do
    its(:gepub_add_method) { is_expected.to eq :add_creator }
  end

  describe CollaboratorRole::Contributor do
    its(:gepub_add_method) { is_expected.to eq :add_contributor }
  end
end
