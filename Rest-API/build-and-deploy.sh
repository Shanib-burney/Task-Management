#!/bin/bash
set -e

# Configuration
# REGISTRY="localhost:5000"  # e.g., docker.io, your-registry.com
IMAGE_NAME="rest-api-app"
VERSION_FILE="version.txt"

# Read current version and increment
if [ -f "$VERSION_FILE" ]; then
    CURRENT_VERSION=$(cat "$VERSION_FILE")
else
    CURRENT_VERSION="1.0.0"
fi

# Increment version (simple semantic versioning: patch +1)
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"

# Save new version
echo "$NEW_VERSION" > "$VERSION_FILE"

TAG="$NEW_VERSION"
LOCAL_IMAGE="$IMAGE_NAME:$TAG"
# FULL_IMAGE="$REGISTRY/$IMAGE_NAME:$TAG"

echo "Building local image: $LOCAL_IMAGE (version: $NEW_VERSION)"
docker build -t "$LOCAL_IMAGE" .

# if [ -n "$REGISTRY" ]; then
#   echo "Tagging remote image: $FULL_IMAGE"
#   docker tag "$LOCAL_IMAGE" "$FULL_IMAGE"
#   echo "Pushing remote image: $FULL_IMAGE"
#   docker push "$FULL_IMAGE"
# fi

echo "Starting services with docker-compose"
API_VERSION="$TAG" docker compose up -d

echo "Deployment complete. Local image: $LOCAL_IMAGE"
