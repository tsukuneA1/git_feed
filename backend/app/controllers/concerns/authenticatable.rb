module Authenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_user!, unless: :skip_authentication?
    attr_reader :current_user
  end

  private

  def authenticate_user!
    token = extract_token_from_header

    unless token
      render json: { error: "Authorization token required" }, status: :unauthorized
      return
    end

    decoded_token = JwtService.decode(token)

    unless decoded_token
      render json: { error: "Invalid or expired token" }, status: :unauthorized
      return
    end

    @current_user = User.find_by(id: decoded_token[:user_id])

    unless @current_user
      render json: { error: "User not found" }, status: :unauthorized
      nil
    end
  end

  def extract_token_from_header
    header = request.headers["Authorization"]
    return nil unless header

    header.split(" ").last if header.start_with?("Bearer ")
  end

  def skip_authentication?
    false
  end

  def current_user_id
    @current_user&.id
  end

  def user_signed_in?
    @current_user.present?
  end
end
