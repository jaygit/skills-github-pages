# GitHub Portfolio

_A dynamic portfolio site showcasing your GitHub projects with automatic updates and customizable classifications._

## Overview

This is a GitHub Pages portfolio that automatically displays your public repositories organized into two categories:
- **Training Repositories**: Tutorials, courses, and learning projects
- **Project Repositories**: Personal projects and contributions

## Features

- 🎨 **Three Theme Options**: Day, Night, and Solarized themes with persistent selection
- 🦁 **Animal Icons**: Each project gets a unique animal emoji (inspired by O'Reilly book covers)
- 📝 **YAML Configuration**: Manual control over project classifications via `projects-config.yaml`
- 🔄 **Automatic Updates**: Run `npm run update-config` to fetch latest repositories from GitHub
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Fast Loading**: YAML-based configuration loads instantly without API rate limits

## Getting Started

### Prerequisites

- Node.js and npm installed
- A GitHub account
- GitHub Pages enabled for your repository

### Setup

1. **Update Configuration**

   Edit `script.js` and change the GitHub username:
   ```javascript
   const GITHUB_USERNAME = 'jaygit'; // Change to your username
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Generate Project Configuration**
   ```bash
   npm run update-config
   ```

4. **Customize Classifications**

   Open `projects-config.yaml` and update the `classification` field for each project:
   - `training` - For tutorials, courses, learning exercises
   - `project` - For personal projects and contributions

5. **Deploy to GitHub Pages**

   Commit and push your changes. The site will be available at:
   ```
   https://[username].github.io/[repository-name]
   ```

## Usage

### Updating Project List

When you create new repositories, update the configuration:

```bash
npm run update-config
```

This preserves your manual classifications and adds new repositories.

### Manual Classification

Edit `projects-config.yaml` to change how projects are categorized:

```yaml
projects:
  - name: my-project
    description: Project description
    classification: project  # or 'training'
    # ... other fields
```

### Theme Selection

Click the theme button in the top-right corner to switch between Day, Night, and Solarized themes. Your selection is saved automatically.

## Project Structure

- `index.html` - Main portfolio page
- `style.css` - Styles and theme definitions
- `script.js` - Portfolio logic and GitHub API integration
- `projects-config.yaml` - Repository configuration with classifications
- `update-config.js` - Script to fetch and update repository data
- `yaml-parser.js` - YAML parsing for configuration

## Customization

- Modify `style.css` to change colors, fonts, and layout
- Update `index.html` to adjust page structure
- Add new themes in `style.css` and `script.js`
- Extend `projects-config.yaml` with custom fields

## Learn More

For detailed information about the YAML configuration system, see [PROJECTS-CONFIG.md](PROJECTS-CONFIG.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by O'Reilly book cover designs for the animal icons
- Built with vanilla JavaScript and GitHub Pages
- Uses [js-yaml](https://github.com/nodeca/js-yaml) for YAML parsing
