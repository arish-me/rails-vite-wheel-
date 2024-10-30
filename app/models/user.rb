# frozen_string_literal: true

class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  devise :database_authenticatable, :registerable, :recoverable,
         :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  # Associations
  has_one :profile, dependent: :destroy

  has_many :user_roles, dependent: :destroy
  has_many :roles, through: :user_roles
  has_many :role_permissions, through: :roles
  # Callback to assign default role after user creation
  after_create :assign_default_role

  # Accept nested attributes for profile and user_roles
  accepts_nested_attributes_for :profile, allow_destroy: true
  accepts_nested_attributes_for :user_roles, allow_destroy: true

  attr_accessor :otp_code

  def generate_otp!
    self.otp_code = rand(100_000..999_999).to_s # Generate a 6-digit OTP
    update!(otp_code: otp_code, otp_generated_at: Time.current)
    # Send OTP via email, SMS, or any method you choose
    # UserMailer.with(user: self, otp_code: otp_code).send_otp.deliver_now
  end

  def otp_expired?
    otp_generated_at < 10.minutes.ago
  end

  # Get all role permissions based on user roles
  def role_permissions
    RolePermission.joins(:role).where(role: roles).distinct
  end

  def generate_jwt
    token, payload = Warden::JWTAuth::UserEncoder.new.call(self, :user, nil)
    update(jti: payload['jti'])
    token
  end

  # private

  def assign_default_role(role_name: 'User')
    user_roles.create(role: Role.find_by(name: role_name)) # Assign 'User' role after user creation
  end
end
