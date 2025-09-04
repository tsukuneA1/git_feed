class ApplicationController < ActionController::API
  around_action :with_db_rls_user

  private

  def with_db_rls_user
    ActiveRecord::Base.connection.transaction(requires_new: true) do
      set_db_current_user(current_user&.id)
      yield
    end
  end

  def set_db_current_user(user_id)
    if user_id
      ActiveRecord::Base.connection.execute(
                "SET LOCAL app.current_user_id = #{ActiveRecord::Base.connection.quote(Integer(user_id))}"
      )
    else
      ActiveRecord::Base.connection.execute(
        "SET LOCAL app.current_user_id = NULL"
      )
    end
  end
end
