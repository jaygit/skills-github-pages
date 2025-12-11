#!/usr/bin/env node

const fs = require('fs');
const yaml = require('js-yaml');

// Configuration - can be overridden with environment variable
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'jaygit';
const CONFIG_FILE = './projects-config.yaml';

// Animal emojis for project icons (O'Reilly style)
const animals = [
    '🦁', '🐯', '🐻', '🐼', '🐨', '🐵', '🐶', '🐺', '🦊', '🦝',
    '🐱', '🦁', '🐴', '🦄', '🦓', '🦌', '🐮', '🐷', '🐗', '🐭',
    '🐹', '🐰', '🐇', '🐿️', '🦔', '🦇', '🐻‍❄️', '🐨', '🐼', '🦥',
    '🦦', '🦨', '🦘', '🦡', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤',
    '🐥', '🐦', '🐧', '🕊️', '🦅', '🦆', '🦢', '🦉', '🦤', '🪶',
    '🦩', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉',
    '🦕', '🦖', '🐳', '🐋', '🐬', '🦭', '🐟', '🐠', '🐡', '🦈',
    '🐙', '🐚', '🪸', '🐌', '🦋', '🐛', '🐝', '🪲', '🐞', '🦗',
    '🕷️', '🦂', '🦟', '🪰', '🪱', '🦠'
];

// Generate a consistent animal emoji based on string hash
function getAnimalForProject(projectName) {
    let hash = 0;
    for (let i = 0; i < projectName.length; i++) {
        const char = projectName.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    const index = Math.abs(hash) % animals.length;
    return animals[index];
}

// Determine if a repo should be classified as training
function getAutoClassification(repo) {
    const name = repo.name.toLowerCase();
    const description = (repo.description || '').toLowerCase();
    const topics = repo.topics || [];
    
    const trainingKeywords = [
        'tutorial', 'course', 'learning', 'practice', 'exercise',
        'training', 'workshop', 'lesson', 'bootcamp', 'skill',
        'learn', 'study', 'example', 'sample', 'demo'
    ];
    
    // Check name
    for (const keyword of trainingKeywords) {
        if (name.includes(keyword)) return 'training';
    }
    
    // Check description
    for (const keyword of trainingKeywords) {
        if (description.includes(keyword)) return 'training';
    }
    
    // Check topics
    for (const topic of topics) {
        for (const keyword of trainingKeywords) {
            if (topic.toLowerCase().includes(keyword)) return 'training';
        }
    }
    
    // Check if it's a low-engagement fork
    if (repo.fork && repo.stargazers_count === 0 && !repo.description) {
        return 'training';
    }
    
    return 'project';
}

async function fetchGitHubRepos() {
    try {
        // Use native fetch (Node.js 18+) or fallback to https module
        let fetchFn = global.fetch;
        if (!fetchFn) {
            // For Node.js < 18, provide a polyfill using https
            const https = require('https');
            fetchFn = (url) => {
                return new Promise((resolve, reject) => {
                    https.get(url, { headers: { 'User-Agent': 'Node.js' } }, (res) => {
                        let data = '';
                        res.on('data', chunk => data += chunk);
                        res.on('end', () => {
                            if (res.statusCode >= 200 && res.statusCode < 300) {
                                resolve({
                                    ok: true,
                                    statusText: res.statusMessage,
                                    json: () => Promise.resolve(JSON.parse(data))
                                });
                            } else {
                                reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                            }
                        });
                    }).on('error', reject);
                });
            };
        }
        
        const response = await fetchFn(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        if (!response.ok) {
            throw new Error(`Failed to fetch repositories: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        throw error;
    }
}

async function updateConfig() {
    console.log('Fetching repositories from GitHub...');
    
    // Fetch repos from GitHub API
    const repos = await fetchGitHubRepos();
    
    // Filter to only public repos
    const publicRepos = repos.filter(repo => !repo.private);
    
    console.log(`Found ${publicRepos.length} public repositories`);
    
    // Load existing config if it exists
    let existingConfig = { projects: [] };
    if (fs.existsSync(CONFIG_FILE)) {
        try {
            const fileContent = fs.readFileSync(CONFIG_FILE, 'utf8');
            existingConfig = yaml.load(fileContent) || { projects: [] };
        } catch (e) {
            console.log('No existing config found or error reading it, starting fresh');
        }
    }
    
    // Create a map of existing projects for easy lookup
    const existingProjects = new Map();
    if (existingConfig.projects) {
        existingConfig.projects.forEach(project => {
            existingProjects.set(project.name, project);
        });
    }
    
    // Build new config, preserving user modifications where they exist
    const newProjects = publicRepos.map(repo => {
        const existing = existingProjects.get(repo.name);
        const autoClassification = getAutoClassification(repo);
        
        return {
            name: repo.name,
            description: repo.description || '',
            url: repo.html_url,
            // Preserve user's classification if it exists, otherwise use auto-detected
            classification: existing?.classification || autoClassification,
            // Generate animal icon based on project name (always consistent)
            image: getAnimalForProject(repo.name),
            language: repo.language || 'Unknown',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            topics: repo.topics || [],
            updated_at: repo.updated_at
        };
    });
    
    // Sort by updated date (most recent first)
    newProjects.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    
    // Create final config
    const config = {
        projects: newProjects
    };
    
    // Write to YAML file with nice formatting
    const yamlStr = yaml.dump(config, {
        indent: 2,
        lineWidth: 120,
        noRefs: true
    });
    
    // Add header comment
    const header = `# Projects Configuration
# This file is dynamically updated with all public repositories from GitHub
# You can manually edit the 'classification' field for each project
# Classification options: training, project
# The 'image' field is automatically generated based on the project name (animal emoji)
# 
# To update this file, run: npm run update-config
#
# Last updated: ${new Date().toISOString()}

`;
    
    fs.writeFileSync(CONFIG_FILE, header + yamlStr, 'utf8');
    console.log(`\n✓ Config file updated successfully: ${CONFIG_FILE}`);
    console.log(`  Total projects: ${newProjects.length}`);
    console.log(`  Training: ${newProjects.filter(p => p.classification === 'training').length}`);
    console.log(`  Projects: ${newProjects.filter(p => p.classification === 'project').length}`);
    console.log('\nYou can now manually edit the classification field for each project in the YAML file.');
}

// Run the update
updateConfig().catch(error => {
    console.error('Failed to update config:', error);
    process.exit(1);
});
