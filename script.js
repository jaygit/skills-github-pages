// Configuration - Update this with your GitHub username
const GITHUB_USERNAME = 'jaygit'; // Change this to your GitHub username

// Language colors (matching GitHub's language colors)
const languageColors = {
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Java: '#b07219',
    TypeScript: '#2b7489',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Ruby: '#701516',
    PHP: '#4F5D95',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Shell: '#89e051',
    // Add more as needed
};

// Fetch user profile and repositories
async function fetchGitHubData() {
    try {
        // Fetch user profile
        const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        
        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        if (!reposResponse.ok) {
            throw new Error('Failed to fetch repositories');
        }
        const reposData = await reposResponse.json();
        
        return { user: userData, repos: reposData };
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        throw error;
    }
}

// Display user profile
function displayUserProfile(user) {
    document.getElementById('avatar').src = user.avatar_url;
    document.getElementById('avatar').alt = `${user.name || user.login}'s avatar`;
    document.getElementById('username').textContent = user.name || user.login;
    
    if (user.bio) {
        document.getElementById('bio').textContent = user.bio;
    } else {
        document.getElementById('bio').style.display = 'none';
    }
    
    document.getElementById('github-link').href = user.html_url;
}

// Create repository card
function createRepoCard(repo) {
    const card = document.createElement('div');
    card.className = 'repo-card';
    
    // Repository header with icon and name
    const header = document.createElement('div');
    header.className = 'repo-header';
    
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('class', 'repo-icon');
    icon.setAttribute('viewBox', '0 0 16 16');
    icon.setAttribute('fill', 'currentColor');
    icon.innerHTML = '<path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>';
    
    const repoLink = document.createElement('a');
    repoLink.href = repo.html_url;
    repoLink.className = 'repo-name';
    repoLink.textContent = repo.name;
    repoLink.target = '_blank';
    repoLink.rel = 'noopener noreferrer';
    
    header.appendChild(icon);
    header.appendChild(repoLink);
    card.appendChild(header);
    
    // Description
    if (repo.description) {
        const description = document.createElement('p');
        description.className = 'repo-description';
        description.textContent = repo.description;
        card.appendChild(description);
    }
    
    // Metadata (language, stars, forks)
    const meta = document.createElement('div');
    meta.className = 'repo-meta';
    
    if (repo.language) {
        const language = document.createElement('span');
        language.className = 'language';
        
        const dot = document.createElement('span');
        dot.className = 'language-dot';
        dot.style.backgroundColor = languageColors[repo.language] || '#ccc';
        
        language.appendChild(dot);
        language.appendChild(document.createTextNode(repo.language));
        meta.appendChild(language);
    }
    
    if (repo.stargazers_count > 0) {
        const stars = document.createElement('span');
        stars.className = 'repo-stat';
        stars.innerHTML = `
            <svg class="stat-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
            </svg>
            ${repo.stargazers_count}
        `;
        meta.appendChild(stars);
    }
    
    if (repo.forks_count > 0) {
        const forks = document.createElement('span');
        forks.className = 'repo-stat';
        forks.innerHTML = `
            <svg class="stat-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
            </svg>
            ${repo.forks_count}
        `;
        meta.appendChild(forks);
    }
    
    card.appendChild(meta);
    
    // Topics/Tags
    if (repo.topics && repo.topics.length > 0) {
        const topics = document.createElement('div');
        topics.className = 'repo-topics';
        
        repo.topics.slice(0, 5).forEach(topic => {
            const tag = document.createElement('a');
            tag.href = `https://github.com/topics/${topic}`;
            tag.className = 'topic-tag';
            tag.textContent = topic;
            tag.target = '_blank';
            tag.rel = 'noopener noreferrer';
            topics.appendChild(tag);
        });
        
        card.appendChild(topics);
    }
    
    return card;
}

// Display repositories
function displayRepositories(repos) {
    const container = document.getElementById('repositories');
    container.innerHTML = '';
    
    // Filter out forks if desired, and sort by stars/updated
    const filteredRepos = repos
        .filter(repo => !repo.fork) // Remove this line if you want to show forks
        .sort((a, b) => b.stargazers_count - a.stargazers_count);
    
    if (filteredRepos.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No public repositories found.</p>';
        return;
    }
    
    filteredRepos.forEach(repo => {
        const card = createRepoCard(repo);
        container.appendChild(card);
    });
}

// Initialize the page
async function init() {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    
    try {
        const { user, repos } = await fetchGitHubData();
        
        displayUserProfile(user);
        displayRepositories(repos);
        
        loadingElement.style.display = 'none';
    } catch (error) {
        console.error('Failed to load GitHub data:', error);
        loadingElement.style.display = 'none';
        errorElement.style.display = 'block';
    }
}

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Load data when page loads
document.addEventListener('DOMContentLoaded', init);
