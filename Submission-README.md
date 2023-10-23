# NWEN304 Group Project

## Application URL

- **Live Demo:** https://nwen304-groupproject-9db15.web.app/
- **GitHub Repository:** https://github.com/AdamRoddick/nwen304-group-project

## Exposed APIs

Our application provides the following APIs:

1. **Registration**
   - Endpoint: `/api/register`
   - Description: Allows users to create an account for the application.

2. **Login**
   - Endpoint: `/api/login`
   - Description: Allows users to login with an account to the application.

## Database Design

Our application uses firestore, a nosql database to store and manage data. Below is a summary of our database design:

### Collections

1. **Users Collection**
   - Purpose: Stores user data, including user profiles.
   - Document Structure:
     - `id` (Auto-generated unique ID)
     - `username` (String)
     - `email` (String)
     - `password` (String)
     - `following` (List of Users)

2. **Posts Collection**
   - Purpose: Stores posts created by users.
   - Document Structure:
     - `id` (Auto-generated unique ID)
     - `title` (String)
     - `content` (String)
     - `author` (Reference to a User)
     - `timestamp` (Time posted)

#!/bin/bash

# Replace these variables with your website variables
BASE_URL=""
AUTH_TOKEN=""
USERNAME=""
PASSWORD=""

# Function to log in and retrieve an access token
function login() {
  local login_data='{"username": "'$USERNAME'", "password": "'$PASSWORD'"}'
  local login_response=$(curl -X POST -H "Content-Type: application/json" -d "$login_data" "$BASE_URL/login")

  AUTH_TOKEN=$(echo "$login_response" | jq -r '.access_token')
  echo "Logged in successfully. Access token: $AUTH_TOKEN"
}

# Function to log out
function logout() {
  curl -X POST -H "Authorization: Bearer $AUTH_TOKEN" "$BASE_URL/logout"
  echo "Logged out successfully."
}

# Function to perform a GET request
function perform_get_request() {
  local endpoint="$1"
  curl -X GET -H "Authorization: Bearer $AUTH_TOKEN" "$BASE_URL$endpoint"
}

# Function to perform a POST request
function perform_post_request() {
  local endpoint="$1"
  local data="$2"
  curl -X POST -H "Authorization: Bearer $AUTH_TOKEN" -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint"
}

# Function to perform a PUT request
function perform_put_request() {
  local endpoint="$1"
  local data="$2"
  curl -X PUT -H "Authorization: Bearer $AUTH_TOKEN" -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint"
}

# Function to perform a DELETE request
function perform_delete_request() {
  local endpoint="$1"
  curl -X DELETE -H "Authorization: Bearer $AUTH_TOKEN" "$BASE_URL$endpoint"
}

# test cases
function run_tests() {
  echo "Running tests..."

  # Test GET request
  echo "Testing GET request..."
  perform_get_request "/resource1"

  # Test POST request
  echo "Testing POST request..."
  perform_post_request "/resource2" '{"key": "value"}'

# Test a PUT request
  echo "Testing PUT request..."
  perform_put_request "/resource3" '{"key": "updated_value"}'

  # Test a DELETE request
  echo "Testing DELETE request..."
  perform_delete_request "/resource4"

# Log in before testing
  login

  # Test a GET request
  echo "Testing GET request..."
  perform_get_request "/resource1"

  # Test a POST request
  echo "Testing POST request..."
  perform_post_request "/resource2" '{"key": "value"}'

  # Log out after testing
  logout

  echo "Tests complete."
}

# Run the tests
run_tests
