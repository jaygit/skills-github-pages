# GitHub Portfolio

_A modern, responsive portfolio site that automatically showcases your public GitHub repositories._

## 🌟 Features

- **Automatic Updates**: Fetches and displays your public repositories using the GitHub API
- **Responsive Design**: Looks great on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface suitable for LinkedIn and professional profiles
- **Repository Details**: Shows stars, forks, languages, topics, and descriptions
- **Easy Customization**: Simple configuration to personalize for your profile

## 🚀 Quick Start

### 1. Enable GitHub Pages

1. Go to your repository **Settings**
2. Navigate to **Pages** in the left sidebar
3. Under **Source**, select the branch you want to deploy (usually `main` or `copilot/add-ui-for-public-repositories`)
4. Click **Save**
5. Your site will be published at `https://<your-username>.github.io/<repository-name>/`

### 2. Customize Your Portfolio

Open `script.js` and update the GitHub username:

```javascript
const GITHUB_USERNAME = 'jaygit'; // Change this to your GitHub username
```

That's it! The site will automatically fetch and display your repositories.

## 📝 Customization Options

### Change Colors

Edit `style.css` to customize the color scheme. The main gradient is in the `.hero` section:

```css
.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Filter Repositories

In `script.js`, modify the `displayRepositories` function to filter repos:

```javascript
const filteredRepos = repos
    .filter(repo => !repo.fork) // Hide forked repos
    .filter(repo => !repo.private) // Hide private repos (already filtered by API)
    .sort((a, b) => b.stargazers_count - a.stargazers_count);
```

### Add More Language Colors

Add more programming language colors in `script.js`:

```javascript
const languageColors = {
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    // Add more languages here
};
```

## 🎨 What's Included

- **index.html** - Main HTML structure
- **style.css** - Responsive CSS styling
- **script.js** - JavaScript for fetching and displaying repositories
- **_config.yml** - Jekyll configuration for GitHub Pages

## 🔄 How It Updates

The portfolio automatically fetches fresh data from the GitHub API every time someone visits the page. As you add new repositories, they'll appear automatically - no manual updates needed!

## 📱 Share on LinkedIn

Once your site is live:

1. Visit your GitHub Pages URL
2. Take a screenshot or use the URL directly
3. Add it to your LinkedIn profile under "Featured" or "Projects"
4. Share the link in posts to showcase your work

## 🛠️ Local Development

To test locally:

1. Open `index.html` in a web browser
2. The site will fetch live data from GitHub's API

Note: For full Jekyll support, you may need to run:
```bash
bundle exec jekyll serve
```

## 📦 Future Enhancements

This is designed as a starter portfolio. Consider adding:

- Custom domain name
- Blog posts or project write-ups
- Contact form
- Analytics tracking
- Dark mode toggle
- Search and filter functionality
- Project categories

<footer>

<!--
  <<< Author notes: Footer >>>
  Add a link to get support, GitHub status page, code of conduct, license link.
-->

---

Get help: [Post in our discussion board](https://github.com/orgs/skills/discussions/categories/github-pages) &bull; [Review the GitHub status page](https://www.githubstatus.com/)

&copy; 2023 GitHub &bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) &bull; [MIT License](https://gh.io/mit)

</footer>
