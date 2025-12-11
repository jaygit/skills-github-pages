/**
 * Simple YAML parser for the projects config
 * This is a minimal parser that handles the specific structure of our config file
 */
function parseProjectsYAML(yamlText) {
    const lines = yamlText.split('\n');
    const projects = [];
    let currentProject = null;
    let inTopics = false;
    
    for (let line of lines) {
        // Skip comments and empty lines
        if (line.trim().startsWith('#') || line.trim() === '') {
            continue;
        }
        
        // Check for project start
        if (line.match(/^\s*- name:/)) {
            if (currentProject) {
                projects.push(currentProject);
            }
            currentProject = {
                topics: []
            };
            const match = line.match(/name:\s*(.+)/);
            if (match) {
                currentProject.name = match[1].trim();
            }
            inTopics = false;
        }
        // Check for other fields
        else if (currentProject) {
            if (line.includes('description:')) {
                const match = line.match(/description:\s*['"]?(.*)['"]?$/);
                if (match) {
                    currentProject.description = match[1].replace(/^['"]|['"]$/g, '').trim();
                }
            }
            else if (line.includes('url:')) {
                const match = line.match(/url:\s*(.+)/);
                if (match) {
                    currentProject.url = match[1].trim();
                }
            }
            else if (line.includes('classification:')) {
                const match = line.match(/classification:\s*(.+)/);
                if (match) {
                    currentProject.classification = match[1].trim();
                }
            }
            else if (line.includes('image:')) {
                const match = line.match(/image:\s*(.+)/);
                if (match) {
                    currentProject.image = match[1].trim();
                }
            }
            else if (line.includes('language:')) {
                const match = line.match(/language:\s*(.+)/);
                if (match) {
                    currentProject.language = match[1].trim();
                }
            }
            else if (line.includes('stars:')) {
                const match = line.match(/stars:\s*(\d+)/);
                if (match) {
                    currentProject.stars = parseInt(match[1]);
                }
            }
            else if (line.includes('forks:')) {
                const match = line.match(/forks:\s*(\d+)/);
                if (match) {
                    currentProject.forks = parseInt(match[1]);
                }
            }
            else if (line.includes('topics:')) {
                inTopics = true;
            }
            else if (inTopics && line.trim().startsWith('- ')) {
                const topic = line.trim().substring(2).trim();
                currentProject.topics.push(topic);
            }
            else if (line.includes('updated_at:')) {
                const match = line.match(/updated_at:\s*(.+)/);
                if (match) {
                    currentProject.updated_at = match[1].trim();
                }
                inTopics = false;
            }
        }
    }
    
    // Add the last project
    if (currentProject) {
        projects.push(currentProject);
    }
    
    return projects;
}

/**
 * Load projects configuration from YAML file
 */
async function loadProjectsConfig() {
    try {
        const response = await fetch('projects-config.yaml');
        if (!response.ok) {
            throw new Error('Failed to load projects config');
        }
        const yamlText = await response.text();
        return parseProjectsYAML(yamlText);
    } catch (error) {
        console.error('Error loading projects config:', error);
        return null;
    }
}
