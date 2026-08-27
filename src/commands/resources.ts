import { intro, outro, select, text } from '@clack/prompts';
import pc from 'picocolors';
import { RESOURCE_CATALOG, CATEGORIES } from '../data/resources.js';
import { handleCancel, displayBox } from '../utils/terminal.js';
import { printMiniBanner } from '../utils/banner.js';
import type { ResourceCategory, ResourceItem } from '../types/catalog.js';

export interface ResourcesCommandOptions {
  category?: string;
  search?: string;
}

export function filterCatalog(options: { category?: string; search?: string }): ResourceItem[] {
  let list = [...RESOURCE_CATALOG];

  if (options.category && options.category !== 'all') {
    list = list.filter((r) => r.category === options.category);
  }

  if (options.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        r.subcategory.toLowerCase().includes(q)
    );
  }

  return list;
}

export function displayResourceCard(res: ResourceItem): void {
  const content =
    `🔗 ${pc.cyan(pc.bold(res.url))}\n\n` +
    `📖 ${res.description}\n\n` +
    `🎁 ${pc.bold('Free Tier')}: ${pc.green(res.freeTier)}\n` +
    `⚖️  ${pc.bold('License Notice')}: ${pc.dim(res.licenseNotice)}\n` +
    `🏷️  ${pc.bold('Tags')}: ${res.tags.map((t) => pc.magenta(`#${t}`)).join(' ')}`;

  displayBox(content, `${res.name} [${res.category}/${res.subcategory}]`, 'cyan');
}

export async function handleResourcesCommand(options: ResourcesCommandOptions = {}): Promise<void> {
  printMiniBanner();

  if (options.category || options.search) {
    const results = filterCatalog(options);
    console.log(pc.bold(`\nFound ${pc.green(results.length)} curated resources:\n`));
    for (const res of results) {
      displayResourceCard(res);
    }
    return;
  }

  intro(pc.bgMagenta(pc.black(' 💎 CURATED FREE RESOURCES EXPLORER ')));

  const categoryChoice = handleCancel(
    await select({
      message: 'Choose a resource category to browse:',
      options: [
        { value: 'all', label: '🌟 All Categories', hint: 'Browse all curated free tools & assets' },
        ...CATEGORIES.map((c) => ({
          value: c.id,
          label: `${c.emoji} ${c.name}`,
          hint: c.description,
        })),
      ],
    })
  );

  const searchFilter = handleCancel(
    await text({
      message: 'Filter by keyword or tag (press Enter to show all):',
      placeholder: 'e.g. icons, tailwind, auth, mock',
    })
  );

  const filtered = filterCatalog({
    category: categoryChoice as string,
    search: searchFilter as string,
  });

  if (filtered.length === 0) {
    console.log(pc.yellow('\nNo resources found matching your filter criteria.'));
    outro(pc.dim('Run `glidingvibe resources` to browse again.'));
    return;
  }

  console.log(pc.bold(`\nDisplaying ${pc.green(filtered.length)} curated resources:\n`));

  for (const res of filtered) {
    displayResourceCard(res);
  }

  outro(pc.bgMagenta(pc.black(' ✨ All resources are curated and free for hackathon & MVP builds! ')));
}
