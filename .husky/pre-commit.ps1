# Read the commit message from standard input
$commitMessage = Get-Content -Path "COMMIT_EDITMSG" -First 1

# Validate the commit message format
if ($commitMessage -notmatch "^(feat|fix|chore|docs|test|style|refactor|perf|build|ci|revert)(\(.+?\))? : .{1,}$") {
    Write-Host "Aborting commit. Your commit message is invalid."
    exit 1
}

# Update the version based on the commit prefix
switch ($commitMessage.Split(':')[0].Trim()) {
    "feat" {
        npm version minor
    }
    "fix" {
        npm version patch
    }
    default {
        # Do nothing
    }
}