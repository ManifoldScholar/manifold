class TextDecorator < ApplicationDecorator
  delegate_all
  decorates_association :project
  decorates_association :comments

  def reader_url
    ClientURL.call(:reader_text, text_slug: slug)
  end

end
