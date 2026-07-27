export function init(projectsJson: string): void {
  const projects = JSON.parse(projectsJson);

  const filters = {
    category: null as string | null,
    techs: [] as string[],
  };

  function render(): void {
    const grid = document.getElementById('project-grid');
    const empty = document.getElementById('empty-state');
    if (!grid) return;

    const filtered = projects.filter((p: any) => {
      const categoryMatch = !filters.category || p.category === filters.category;
      const techMatch =
        filters.techs.length === 0 || filters.techs.every((t) => p.tech.includes(t));
      return categoryMatch && techMatch;
    });

    grid.innerHTML = filtered
      .map(
        (p: any) => `
      <div class="project-card" style="border-left-color:${
        p.status === 'active'
          ? 'var(--color-active)'
          : p.status === 'backlog'
            ? 'var(--color-backlog)'
            : p.status === 'stalled'
              ? 'var(--color-stalled)'
              : 'var(--color-completed)'
      }">
        <div class="card-header">
          <h3 class="card-title">${escapeHtml(p.title)}</h3>
          <span class="status-badge" style="background:${
            p.status === 'active'
              ? 'var(--color-status-active-bg)'
              : p.status === 'backlog'
                ? 'var(--color-status-backlog-bg)'
                : p.status === 'stalled'
                  ? 'var(--color-status-stalled-bg)'
                  : 'var(--color-status-completed-bg)'
          };color:${
            p.status === 'active'
              ? 'var(--color-status-active-text)'
              : p.status === 'backlog'
                ? 'var(--color-status-backlog-text)'
                : p.status === 'stalled'
                  ? 'var(--color-status-stalled-text)'
                  : 'var(--color-status-completed-text)'
          }">${
            p.status === 'active'
              ? '● Active'
              : p.status === 'backlog'
                ? '○ Backlog'
                : p.status === 'stalled'
                  ? '◐ Stalled'
                  : '● Completed'
          }</span>
        </div>
        ${p.description ? `<p class="card-description">${escapeHtml(p.description)}</p>` : ''}
        ${p.githubData ? `
          <div class="card-github">
            <span class="github-stars">★ ${p.githubData.stars}</span>
            ${p.githubData.language ? `<span class="github-language">${escapeHtml(p.githubData.language)}</span>` : ''}
          </div>
        ` : ''}
        <div class="card-tags">
          <span class="tag tag-category" style="background:${
            p.category === 'fun'
              ? 'var(--color-tag-fun-bg)'
              : p.category === 'learning'
                ? 'var(--color-tag-learning-bg)'
                : 'var(--color-tag-useful-bg)'
          };color:${
            p.category === 'fun'
              ? 'var(--color-tag-fun-text)'
              : p.category === 'learning'
                ? 'var(--color-tag-learning-text)'
                : 'var(--color-tag-useful-text)'
          }">${escapeHtml(p.category)}</span>
          ${p.tech.map((t: string) => `<span class="tag tag-tech">${escapeHtml(t)}</span>`).join('')}
        </div>
        ${p.github ? `<a class="card-link" href="https://github.com/${escapeHtml(p.github)}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.github)}</a>` : ''}
      </div>
    `
      )
      .join('');

    if (empty) {
      empty.style.display = filtered.length === 0 ? 'block' : 'none';
    }
  }

  function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Category filters
    document.querySelectorAll('[data-category]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        filters.category = filters.category === category ? null : category;
        document.querySelectorAll('[data-category]').forEach((b) => {
          b.classList.toggle('filter-pill-active', b.getAttribute('data-category') === filters.category);
          b.classList.toggle('filter-pill-active', filters.category === null && b.getAttribute('data-category') === '');
        });
        render();
      });
    });

    // Tech filters
    document.querySelectorAll('[data-tech]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tech = btn.getAttribute('data-tech') || '';
        if (filters.techs.includes(tech)) {
          filters.techs = filters.techs.filter((t) => t !== tech);
        } else {
          filters.techs = [...filters.techs, tech];
        }
        document.querySelectorAll('[data-tech]').forEach((b) => {
          const t = b.getAttribute('data-tech') || '';
          b.classList.toggle('filter-pill-active-tech', filters.techs.includes(t));
        });
        render();
      });
    });

    // Clear tech
    const clearBtn = document.getElementById('clear-tech');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        filters.techs = [];
        document.querySelectorAll('[data-tech]').forEach((b) => {
          b.classList.remove('filter-pill-active-tech');
        });
        render();
      });
    }
  });
}
