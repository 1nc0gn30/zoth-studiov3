import { Handler } from '@netlify/functions';
import challengeData from '../../src/challenge-config.json';

interface Project {
  id: number;
  title: string;
  date: string;
  url: string;
  description: string;
  tags: string[];
  thumbnail: string;
}

interface SocialPost {
  platform: string;
  url: string;
  content: string;
  date: string;
}

interface Season {
  id: number;
  name: string;
  challenge: {
    title: string;
    startDate: string;
    endDate: string;
    targetCount: number;
  };
  projects: Project[];
  socialPosts: SocialPost[];
}

const data = challengeData as { seasons: Season[] };

export const handler: Handler = async (event) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Parse path - handle redirects where path might be /api/projects or just /projects
  let path = event.path.replace(/^\/api\/?/, '').toLowerCase();
  // Strip trailing slashes
  path = path.replace(/\/+$/, '');
  
  const params = event.queryStringParameters || {};
  
  const seasonParam = params.season ? parseInt(params.season, 10) : null;
  const searchParam = params.search ? params.search.toLowerCase() : null;
  const limitParam = params.limit ? parseInt(params.limit, 10) : null;
  const formatParam = params.format ? params.format.toLowerCase() : 'json';

  // Helper to format responses
  const respond = (bodyData: any, markdownFormatter: () => string) => {
    if (formatParam === 'markdown' || formatParam === 'md' || formatParam === 'text' || formatParam === 'txt') {
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'text/markdown; charset=utf-8'
        },
        body: markdownFormatter()
      };
    }
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(bodyData, null, 2)
    };
  };

  // Route: /api/seasons
  if (path === 'seasons') {
    const seasonsList = data.seasons.map(s => ({
      id: s.id,
      name: s.name,
      title: s.challenge.title,
      startDate: s.challenge.startDate,
      endDate: s.challenge.endDate,
      targetCount: s.challenge.targetCount,
      projectCount: s.projects.length,
      postCount: s.socialPosts.length
    }));

    return respond(seasonsList, () => {
      let md = `# Seasons of ${data.seasons[0].challenge.title}\n\n`;
      seasonsList.forEach(s => {
        md += `## Season ${s.id}: ${s.name}\n`;
        md += `- **Challenge**: ${s.title}\n`;
        md += `- **Timeline**: ${s.startDate.split('T')[0]} to ${s.endDate.split('T')[0]}\n`;
        md += `- **Progress**: ${s.projectCount} / ${s.targetCount} projects shipped\n`;
        md += `- **Social Updates**: ${s.postCount} posts logged\n\n`;
      });
      return md;
    });
  }

  // Route: /api/projects
  if (path === 'projects') {
    let filteredProjects: Array<Project & { seasonId: number; seasonName: string }> = [];

    data.seasons.forEach(s => {
      if (seasonParam !== null && s.id !== seasonParam) return;
      s.projects.forEach(p => {
        if (searchParam) {
          const matchTitle = p.title.toLowerCase().includes(searchParam);
          const matchDesc = p.description.toLowerCase().includes(searchParam);
          const matchTags = p.tags.some(t => t.toLowerCase().includes(searchParam));
          if (!matchTitle && !matchDesc && !matchTags) return;
        }
        filteredProjects.push({
          ...p,
          seasonId: s.id,
          seasonName: s.name
        });
      });
    });

    // Sort newest first
    filteredProjects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (limitParam !== null) {
      filteredProjects = filteredProjects.slice(0, limitParam);
    }

    return respond(filteredProjects, () => {
      let md = `# Shipped Projects (${filteredProjects.length} found)\n\n`;
      filteredProjects.forEach(p => {
        md += `### ${p.title}\n`;
        md += `- **Season**: ${p.seasonName} (Season ${p.seasonId})\n`;
        md += `- **Date Shipped**: ${p.date.split('T')[0]}\n`;
        md += `- **URL**: [${p.url}](${p.url})\n`;
        md += `- **Description**: ${p.description}\n`;
        md += `- **Tags**: ${p.tags.map(t => `\`${t}\``).join(', ')}\n\n`;
      });
      return md;
    });
  }

  // Route: /api/feed or /api/posts
  if (path === 'feed' || path === 'posts') {
    let filteredPosts: Array<SocialPost & { seasonId: number; seasonName: string }> = [];

    data.seasons.forEach(s => {
      if (seasonParam !== null && s.id !== seasonParam) return;
      s.socialPosts.forEach(post => {
        if (searchParam) {
          if (!post.content.toLowerCase().includes(searchParam)) return;
        }
        filteredPosts.push({
          ...post,
          seasonId: s.id,
          seasonName: s.name
        });
      });
    });

    // Sort newest first
    filteredPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (limitParam !== null) {
      filteredPosts = filteredPosts.slice(0, limitParam);
    }

    return respond(filteredPosts, () => {
      let md = `# Build Feed Updates (${filteredPosts.length} posts)\n\n`;
      filteredPosts.forEach(post => {
        md += `### Post on ${post.date.split('T')[0]} (${post.platform})\n`;
        md += `> ${post.content}\n\n`;
        md += `[View original post](${post.url})\n\n---\n\n`;
      });
      return md;
    });
  }

  // Default Route: /api (Root documentation)
  const stats = {
    title: data.seasons[0].challenge.title,
    seasonsCount: data.seasons.length,
    totalProjectsCount: data.seasons.reduce((acc, s) => acc + s.projects.length, 0),
    totalPostsCount: data.seasons.reduce((acc, s) => acc + s.socialPosts.length, 0),
    endpoints: [
      { path: '/api/seasons', description: 'List of seasons with timeline dates, project statistics, and goals.' },
      { path: '/api/projects', description: 'All shipped websites. Supports ?season=2, ?search=canvas, ?limit=5, & ?format=markdown.' },
      { path: '/api/feed', description: 'Chronological timeline of social media posts, build announcements, and deployments.' }
    ]
  };

  return respond(stats, () => {
    let md = `# 100 Websites in 30 Days API\n`;
    md += `Welcome to the developer & AI Agent API for Zoth Studio Team's 100 Websites Challenge.\n\n`;
    md += `## Challenge Stats\n`;
    md += `- **Challenge**: ${stats.title}\n`;
    md += `- **Seasons**: ${stats.seasonsCount}\n`;
    md += `- **Total Shipped**: ${stats.totalProjectsCount} projects\n`;
    md += `- **Total Social Updates**: ${stats.totalPostsCount} posts\n\n`;
    md += `## Available Endpoints\n\n`;
    stats.endpoints.forEach(e => {
      md += `### \`GET ${e.path}\`\n`;
      md += `${e.description}\n\n`;
    });
    md += `## AI / Agent Integrations\n`;
    md += `If you are fetching this from an AI model or curl terminal, append \`?format=markdown\` or \`?format=txt\` to any endpoint to receive a clean, readable Markdown structure instead of JSON.\n\n`;
    md += `### Curl Example\n`;
    md += `\`\`\`bash\n`;
    md += `curl "https://100websitesin30days.nullai.tech/api/projects?season=2&format=markdown"\n`;
    md += `\`\`\`\n`;
    return md;
  });
};
