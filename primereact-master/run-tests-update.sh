#!/bin/sh

# Create a directory for test results
mkdir -p test-results

# Start storybook in the background
npm run start &
storybook_pid=$!

# Wait a bit for the server to come up
sleep 10

# Run tests and store the exit code
npm run test:update
test_exit_code=$?

# Kill the background server
kill $storybook_pid

# Exit with the stored exit code
exit $test_exit_code
