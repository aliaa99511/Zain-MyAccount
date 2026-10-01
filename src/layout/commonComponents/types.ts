import type { layout_sentences } from "../../configurations/language";

export type MenuKey = keyof typeof layout_sentences;

export type MenuItem = {
    label: MenuKey;
    icon: React.ReactNode;
    path?: string;
    children?: MenuItem[];
};
