# frozen_string_literal: true

# Create Roles
%w[Admin SuperAdmin Guest User].each do |name|
  Role.create(name:)
end

user = User.create!(email: 'superadmin@wheel.com', password: 'password',
                    password_confirmation: 'password')

user.assign_default_role(role_name: 'SuperAdmin')

MODEL_NAME = %w[
  User
  Category
  Role
  RolePermission
  UserRole
].freeze
# Iterate through each model and create permissions for view and edit actions
MODEL_NAME.each do |name|
  Role.all.each do |role|
    RolePermission.create(role:, resource: name, action: :view)
  end
end
