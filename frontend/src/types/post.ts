export type Post = {
  ID: string;
  TITLE: string;
  SLUG: string;
  CATEGORY_NAME?: string;
  TAGS_NAME?: string[];
  MAIN_TEXT: string;
  CREATE_DATE: string;
};
