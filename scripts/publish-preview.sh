#!/usr/bin/env bash
# Publish the current working tree to the standalone preview site.
#
# The preview lives in a separate repository so that experiments never touch
# the production Pages deployment on andrewgeorgiou.co.uk.
#
#   ./scripts/publish-preview.sh
#
# Requires a git remote named "preview" pointing at the sandbox repository:
#   git remote add preview https://github.com/A-Georgiou/personal-webpage-preview.git
set -euo pipefail

remote="${PREVIEW_REMOTE:-preview}"
branch="${PREVIEW_BRANCH:-site}"

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

if ! remote_url="$(git remote get-url "$remote" 2>/dev/null)"; then
    echo "No git remote named '${remote}'." >&2
    echo "Add it with: git remote add ${remote} https://github.com/A-Georgiou/personal-webpage-preview.git" >&2
    exit 1
fi

source_branch="$(git rev-parse --abbrev-ref HEAD)"
source_commit="$(git rev-parse --short HEAD)"

if [ "$source_branch" = "main" ]; then
    echo "Refusing to publish 'main' to the preview site; switch to a design branch first." >&2
    exit 1
fi

staging="$(mktemp -d)"
trap 'rm -rf "$staging"' EXIT

rsync -a --exclude '.git' --exclude '.github' --exclude 'scripts' ./ "$staging/"

# Sandbox-only files: keep the staging site out of search engines and skip Jekyll.
printf 'User-agent: *\nDisallow: /\n' >"$staging/robots.txt"
: >"$staging/.nojekyll"

cd "$staging"
git init -q -b "$branch"
git add -A
git -c user.name="preview" -c user.email="preview@users.noreply.github.com" \
    commit -qm "Preview of ${source_branch} @ ${source_commit}"
git push -q --force "$remote_url" "$branch"

echo "Published ${source_branch} (${source_commit}) to ${remote_url} [${branch}]"
