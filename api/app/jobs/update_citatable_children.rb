class UpdateCitatableChildren < ApplicationJob
  queue_as :default

  def perform(parent)
    return unless parent.citable_children.any?

    parent.citable_children.each { |child| parent.send(child).each(&:save) }
  end
end
