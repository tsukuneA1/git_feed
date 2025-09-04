class ApplicationController < ActionController::API
      before_action :authenticate_user!
      private

  def current_user
    return @current_user if defined?(@current_user)
    auth_header = request.headers["Authorization"]
    if auth_header.present? && auth_header.start_with?("Bearer ")
      token = auth_header.split(" ").last
      begin
        payload = JwtService.decode(token)
        @current_user = User.find_by(id: payload["user_id"])
      rescue => e
        Rails.logger.warn "JWT decode error: #{e}"
        @current_user = nil
      end
    end
    @current_user
  end

  def authenticate_user!
    head :unauthorized unless current_user
  end
end
