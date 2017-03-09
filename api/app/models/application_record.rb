# Base class for Manifold models to inherit from
class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  IMAGE_STYLES = {
    small: ["320x320"],
    small_square: "",
    small_landscape: "",
    small_portrait: "",
    medium: ["480x480"],
    medium_square: "",
    medium_landscape: "",
    medium_portrait: ""
  }.freeze

  IMAGE_CONVERT_OPTIONS = {
    small_square: "-gravity north -thumbnail 320x320^ -extent 320x320",
    small_landscape: "-gravity north -thumbnail 320x200^ -extent 320x200",
    small_portrait: "-gravity north -thumbnail 320x246^ -extent 320x246",
    medium_square: "-gravity north -thumbnail 480x480^ -extent 480x480",
    medium_landscape: "-gravity north -thumbnail 480x300^ -extent 480x300",
    medium_portrait: "-gravity north -thumbnail 480x369^ -extent 480x369"
  }.freeze


end
