const LEADING_ARTICLE_PATTERN = /^(a|an|the)\s+/i;
const LETTER_PATTERN = /^[A-Z]$/;
const HASH_LABEL = '#';

const collator = new Intl.Collator(undefined, {
    sensitivity: 'base',
    numeric: true,
});

export const ALPHABETICAL_SECTION_LABELS = [
    HASH_LABEL,
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
];

const normalizeTitle = (title: string): string =>
    title.trim().replace(LEADING_ARTICLE_PATTERN, '').trim();

export const getAlphabeticalSectionLabel = (title: string): string => {
    const normalizedTitle = normalizeTitle(title);
    const firstCharacter = normalizedTitle.charAt(0).toUpperCase();

    return LETTER_PATTERN.test(firstCharacter) ? firstCharacter : HASH_LABEL;
};

export const getAlphabeticalSectionId = (
    viewName: string,
    label: string
): string =>
    `${viewName}-section-${label === HASH_LABEL ? 'hash' : label.toLowerCase()}`;

type SectionItem<T> = {
    item: T;
    normalizedTitle: string;
};

export type AlphabeticalSection<T> = {
    label: string;
    items: T[];
};

export const groupItemsByAlphabet = <T>(
    items: T[],
    getTitle: (item: T) => string
): AlphabeticalSection<T>[] => {
    const sortedItems: SectionItem<T>[] = items
        .map((item) => ({
            item,
            normalizedTitle: normalizeTitle(getTitle(item)),
        }))
        .sort((a, b) => collator.compare(a.normalizedTitle, b.normalizedTitle));

    const sections = new Map<string, T[]>();

    for (const { item, normalizedTitle } of sortedItems) {
        const label = getAlphabeticalSectionLabel(normalizedTitle);
        const sectionItems = sections.get(label);

        if (sectionItems) {
            sectionItems.push(item);
        } else {
            sections.set(label, [item]);
        }
    }

    return Array.from(sections.entries())
        .sort(([a], [b]) => {
            if (a === HASH_LABEL) {
                return -1;
            }

            if (b === HASH_LABEL) {
                return 1;
            }

            return collator.compare(a, b);
        })
        .map(([label, groupedItems]) => ({
            label,
            items: groupedItems,
        }));
};
