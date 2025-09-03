class ChangeAvatarUrlToNotNull < ActiveRecord::Migration[8.0]
  def up
    User.where(avatar_url: nil).update_all(avatar_url: "")

    change_column_null :users, :avatar_url, false, ""
  end

  def down
    change_column_null :users, :avatar_url, true
  end
end
