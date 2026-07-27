// ── Types ──────────────────────────────────────────────────────────────

interface Project {
  id: number;
  title: string;
  status: string;
  category: string;
  tech: string[];
  description: string;
  github: string | null;
  githubData?: {
    stars: number;
    language: string;
  };
}

interface Filters {
  category: string | null;
  techs: string[];
}

// ── Token maps ─────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; symbol: string; border: string; bg: string; text: string }> = {
  active:   { label: 'Active',   symbol: '●', border: 'var(--color-active)',         bg: 'var(--color-status-active-bg)',   text: 'var(--color-status-active-text)' },
  backlog:  { label: 'Backlog',  symbol: '○', border: 'var(--color-backlog)',        bg: 'var(--color-status-backlog-bg)',  text: 'var(--color-status-backlog-text)' },
  stalled:  { label: 'Stalled',  symbol: '◐', border: 'var(--color-stalled)',        bg: 'var(--color-status-stalled-bg)',  text: 'var(--color-status-stalled-text)' },
  completed:{ label: 'Completed',symbol: '●', border: 'var(--color-completed)',      bg: 'var(--color-status-completed-bg)',text: 'var(--color-status-completed-text)' },
};

const CATEGORY_CONFIG: Record<string, { bg: string; text: string }> = {
  fun:       { bg: 'var(--color-tag-fun-bg)',       text: 'var(--color-tag-fun-text)' },
  learning:  { bg: 'var(--color-tag-learning-bg)',   text: 'var(--color-tag-learning-text)' },
  useful:    { bg: 'var(--color-tag-useful-bg)',     text: 'var(--color-tag-useful-text)' },
};

// ── Helpers ────────────────────────────────────────────────────────────

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function matchesFilters(project: Project, filters: Filters): boolean {
  const categoryMatch = !filters.category || project.category === filters.category;
  const techMatch = filters.techs.length === 0 || filters.techs.every((t) => project.tech.includes(t));
  return categoryMatch && techMatch;
}

function renderProjectCard(project: Project): string {
  const status = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.backlog;
  const category = CATEGORY_CONFIG[project.category] ?? CATEGORY_CONFIG.useful;

  return `
    <div class="project-card" style="border-left-color:${status.border}">
      <div class="card-header">
        <h3 class="card-title">${escapeHtml(project.title)}</h3>
        <span class="status-badge" style="background:${status.bg};color:${status.text}">${status.symbol} ${status.label}</span>
      </div>
      ${project.description ? `<p class="card-description">${escapeHtml(project.description)}</p>` : ''}
      ${project.githubData ? `
        <div class="card-github">
          <span class="github-stars">★ ${project.githubData.stars}</span>
          ${project.githubData.language ? `<span class="github-language">${escapeHtml(project.githubData.language)}</span>` : ''}
        </div>
      ` : ''}
      <div class="card-tags">
        <span class="tag tag-category" style="background:${category.bg};color:${category.text}">${escapeHtml(project.category)}</span>
        ${project.tech.map((t) => `<span class="tag tag-tech">${escapeHtml(t)}</span>`).join('')}
      </div>
      ${project.github ? `<a class="card-link" href="https://github.com/${escapeHtml(project.github)}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.github)}</a>` : ''}
    </div>
  `;
}

// ── Main ───────────────────────────────────────────────────────────────

export function init(projectsJson: string): void {
  const projects: Project[] = JSON.parse(projectsJson);
  const filters: Filters = { category: null, techs: [] };

  const grid = document.getElementById('project-grid');
  const empty = document.getElementById('empty-state');
  const categoryButtons = document.querySelectorAll('[data-category]');
  const techButtons = document.querySelectorAll('[data-tech]');
  const clearTechBtn = document.getElementById('clear-tech');

  function render(): void {
    if (!grid) return;

    const filtered = projects.filter((p) => matchesFilters(p, filters));
    grid.innerHTML = filtered.map(renderProjectCard).join('');

    if (empty) {
      empty.style.display = filtered.length === 0 ? 'block' : 'none';
    }
  }

  function syncCategoryPills(): void {
    categoryButtons.forEach((btn) => {
      const isActive = btn.getAttribute('data-category') === filters.category;
      btn.classList.toggle('filter-pill-active', isActive);
    });
  }

  function syncTechPills(): void {
    techButtons.forEach((btn) => {
      const tech = btn.getAttribute('data-tech') || '';
      const isActive = filters.techs.includes(tech);
      btn.classList.toggle('filter-pill-active-tech', isActive);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    categoryButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category') ?? '';
        filters.category = filters.category === category ? null : category;
        syncCategoryPills();
        render();
      });
    });

    techButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tech = btn.getAttribute('data-tech') || '';
        if (filters.techs.includes(tech)) {
          filters.techs = filters.techs.filter((t) => t !== tech);
        } else {
          filters.techs = [...filters.techs, tech];
        }
        syncTechPills();
        render();
      });
    });

    clearTechBtn?.addEventListener('click', () => {
      filters.techs = [];
      syncTechPills();
      render();
    });
  });
}
