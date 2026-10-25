# kenjiwagner.github.io

Personal portfolio and resume site, built with [Astro](https://astro.build) and deployed to GitHub Pages.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321
```

## Where things live

| What | File |
|---|---|
| Name, intro, links, which GitHub accounts to pull from | `src/site.config.ts` |
| Resume content (resume page + home page experience) | `src/data/resume.yaml` |
| Downloadable resume | `public/Kenji_Wagner_Resume.pdf` |
| Hand-written project pages | `src/content/projects/*.md` |

## Adding projects

**From GitHub (automatic):** add the topic `portfolio` to any public repo on the `kenjiwagner` account
(repo page → ⚙ next to "About" → Topics). The next build creates a page at `/projects/<repo-name>`
from the repo's description, language, stars, and README.

To customize that page, add a `portfolio.yml` at the root of the repo:

```yaml
title: Nicer Project Name
summary: One sentence a recruiter will read.
featured: true            # show on the home page
period: Jan 2026 – Mar 2026
tags: [Python, PyTorch]
demo: https://example.com
highlights:
  - 94% accuracy on held-out data
```

**Not on GitHub:** add a Markdown file to `src/content/projects/` (copy an existing one). Set
`repo: kenjiwagner/<name>` in its front matter to attach the repo's link and stars. If that repo is
also tagged `portfolio`, the Markdown page is used instead of a duplicate.

## How it stays current

`.github/workflows/deploy.yml` rebuilds the site on every push, every night at 09:00 UTC, and on demand
(Actions tab → "Deploy to GitHub Pages" → Run workflow). So a newly tagged repo appears within a day.

For instant updates, a project repo can trigger a rebuild on push. That needs a fine-grained personal
access token with *Contents: read & write* on this repo, saved as the `PORTFOLIO_DISPATCH_TOKEN`
secret in the project repo, and this workflow:

```yaml
# .github/workflows/portfolio.yml in a project repo
on: { push: { branches: [main] } }
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -sf -X POST \
            -H "Authorization: Bearer ${{ secrets.PORTFOLIO_DISPATCH_TOKEN }}" \
            -H "Accept: application/vnd.github+json" \
            https://api.github.com/repos/kenjiwagner/kenjiwagner.github.io/dispatches \
            -d '{"event_type":"rebuild"}'
```

## Deploying

1. Create a public repo named **`kenjiwagner.github.io`** on the `kenjiwagner` account.
2. Push this folder to it.
3. Repo → Settings → Pages → Source: **GitHub Actions**.

The site goes live at https://kenjiwagner.github.io.
