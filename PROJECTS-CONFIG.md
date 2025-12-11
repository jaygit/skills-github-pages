# Projects Configuration Guide

## Overview

This portfolio now supports a YAML-based configuration system for managing project classifications. Instead of relying solely on automatic detection, you can manually control how each repository is categorized.

## Features

1. **YAML Configuration File**: All public repositories are stored in `projects-config.yaml`
2. **Manual Classification**: Change any project's classification by editing the YAML file
3. **Animal Icons**: Each project gets a unique animal emoji (like O'Reilly book covers) based on its name
4. **Dynamic Updates**: Run `npm run update-config` to fetch latest repositories from GitHub

## Getting Started

### Installation

```bash
npm install
```

### Updating the Configuration

To fetch all public repositories and update the `projects-config.yaml` file:

```bash
npm run update-config
```

This command will:
- Fetch all public repositories from your GitHub account
- Generate/update the `projects-config.yaml` file
- Preserve any manual classifications you've made
- Assign a unique animal emoji to each project

## YAML Configuration Format

The `projects-config.yaml` file has the following structure:

```yaml
projects:
  - name: repository-name
    description: Repository description
    url: https://github.com/username/repository-name
    classification: training  # or 'project'
    image: 🦁  # Automatically generated animal emoji
    language: JavaScript
    stars: 10
    forks: 2
    topics:
      - topic1
      - topic2
    updated_at: 2025-12-11T05:40:19.718Z
```

## Manual Classification

You can manually change the classification of any project:

1. Open `projects-config.yaml`
2. Find the project you want to reclassify
3. Change the `classification` field to either:
   - `training` - For tutorials, courses, learning projects
   - `project` - For personal projects and contributions
4. Save the file
5. Refresh your GitHub Pages site to see the changes

## Classification Options

- **training**: Repositories that are:
  - Tutorials or courses
  - Learning exercises
  - Practice projects
  - Workshop materials
  - Skills development

- **project**: Repositories that are:
  - Personal projects
  - Open source contributions
  - Production applications
  - Libraries or tools

## How It Works

1. **Initial Load**: When the page loads, it first tries to load from `projects-config.yaml`
2. **Fallback**: If the YAML file is not available, it falls back to the GitHub API
3. **Auto-Detection**: New projects get auto-classified on first run of `update-config`
4. **Preservation**: Your manual edits are preserved when running `update-config` again

## Animal Icons

Each project automatically gets a unique animal emoji based on its name. The emoji is:
- Deterministic (same name = same animal)
- Visually distinctive
- Inspired by O'Reilly book cover style

The icon adds personality and makes it easier to quickly identify projects.

## Workflow

### For First-Time Setup

```bash
# Install dependencies
npm install

# Generate initial configuration
npm run update-config

# Edit classifications as needed
nano projects-config.yaml  # or use your preferred editor

# Commit changes
git add projects-config.yaml
git commit -m "Update project classifications"
git push
```

### For Regular Updates

```bash
# Fetch latest repositories
npm run update-config

# Review and adjust classifications
nano projects-config.yaml

# Commit changes
git add projects-config.yaml
git commit -m "Update project list"
git push
```

## Tips

1. **Preserve Classifications**: The update script preserves your manual classifications, so you only need to classify new projects
2. **Regular Updates**: Run `npm run update-config` periodically to add new repositories
3. **Version Control**: Commit the YAML file to track changes over time
4. **Customization**: You can add more classification types in the future by editing the YAML structure

## Troubleshooting

### GitHub API Rate Limits

If you encounter rate limiting when running `npm run update-config`, you can:
- Wait for the rate limit to reset
- Use a GitHub personal access token (set as environment variable)
- Manually edit the YAML file for new projects

### YAML Syntax Errors

If the page doesn't load projects:
- Check `projects-config.yaml` for syntax errors
- Ensure proper indentation (2 spaces)
- Validate YAML syntax using online validators

### Icons Not Showing

If animal icons don't appear:
- Check that the `image` field exists in YAML
- Ensure your browser supports emoji rendering
- Try refreshing the page
