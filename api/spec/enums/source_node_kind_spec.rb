require "rails_helper"

RSpec.describe SourceNodeKind, packaging: true, type: :enum do
  subject { described_class.new }

  describe SourceNodeKind::Element do
    it { is_expected.to be_an_element }
  end

  describe SourceNodeKind::Text do
    it { is_expected.to be_a_text }
  end

  describe SourceNodeKind::Comment do
    it { is_expected.to be_a_comment }
  end
end
