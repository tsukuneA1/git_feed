class Tag < ApplicationRecord
  validates :slug, presence: true, uniqueness: true
end