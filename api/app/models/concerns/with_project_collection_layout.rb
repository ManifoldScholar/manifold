module WithProjectCollectionLayout
  extend ActiveSupport::Concern

  included do
    include Attachments

    manifold_has_attached_file :hero, :image
    manifold_has_attached_file :custom_icon, :image

    enum hero_layout: {
      square_inset: 0,
      wide_inset: 1,
      full_bleed: 2
    }
  end
end
