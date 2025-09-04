class Tag < ApplicationRecord
  has_many :user_tag_prefs
  has_many :users, through: :user_tag_prefs
end
