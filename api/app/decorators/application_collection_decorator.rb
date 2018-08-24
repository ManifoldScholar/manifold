# This collection decorator will delegate all methods to scope
# for seamless usage.
#
# @abstract
class ApplicationCollectionDecorator < Draper::CollectionDecorator
  # delegate_missing_to :object
  # This can be enabled when Rails is upgraded to 5.0
end
