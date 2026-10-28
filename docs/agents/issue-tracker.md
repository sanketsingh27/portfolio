# Issue tracker: GitHub

Issues and specs live in sanketsingh27/portfolio.
Use the gh CLI from this repository.

- Create: `gh issue create --title "..." --body-file <file>`
- Read: `gh issue view <number> --comments`
- List: `gh issue list --state open --json number,title,labels`
- Comment: `gh issue comment <number> --body-file <file>`
- Label: `gh issue edit <number> --add-label "<label>"`
- Remove label: `gh issue edit <number> --remove-label "<label>"`
- Close: `gh issue close <number>`

Use temporary files for multiline bodies.
Verify the target against `git remote -v`.

PRs as a request surface: no.

“Publish to the issue tracker” means create a GitHub issue.
“Fetch the relevant ticket” means read the issue and comments.
