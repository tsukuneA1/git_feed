class Language < ApplicationRecord
    validates :name, :slug, :lang_type, presence: true
    validates :name, :slug, uniqueness: true
end
