class MakeTagsSlugAndLabelNotNull < ActiveRecord::Migration[8.0]
  def up
    change_column_null :tags, :slug, false
    change_column_null :tags, :label, false
  end

  def down
    change_column_null :tags, :slug, true
    change_column_null :tags, :label, true
  end
end
