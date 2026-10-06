export const normalizeSearchText = (value: string = ""): string => {
    return value
        .toLocaleLowerCase()
        // Arabic diacritics
        .replace(/[\u064B-\u065F\u0670]/g, "")
        // Tatweel
        .replace(/\u0640/g, "")
        // Alef variations
        .replace(/[إأآٱ]/g, "ا")
        // Yeh variations
        .replace(/[ى]/g, "ي")
        // Teh Marbuta
        .replace(/ة/g, "ه")
        // Normalize whitespace
        .replace(/\s+/g, " ")
        .trim();
};

export const faqMatchesSearch = (
    question: string,
    answer: string,
    search: string
): boolean => {
    const normalizedSearch = normalizeSearchText(search);

    if (!normalizedSearch) {
        return true;
    }

    const normalizedQuestion = normalizeSearchText(question);

    const normalizedAnswer = normalizeSearchText(answer);

    return (
        normalizedQuestion.includes(normalizedSearch) ||
        normalizedAnswer.includes(normalizedSearch)
    );
};