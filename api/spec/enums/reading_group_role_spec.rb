require 'rails_helper'

RSpec.describe ReadingGroupRole do
  subject { described_class.new }

  describe ReadingGroupRole::Moderator, enum: true do
    its(:to_role_name) { is_expected.to be_moderator }
  end

  describe ReadingGroupRole::Member, enum: true do
    its(:to_role_name) { is_expected.to be_member }
  end
end
