declare module "gray-matter" {
  interface GrayMatterFile<T> {
    data: T;
    content: string;
    excerpt?: string;
    isEmpty?: boolean;
    stringify?: (data: T) => string;
  }

  interface GrayMatterOption<T> {
    excerpt?:
      | boolean
      | ((file: GrayMatterFile<T>, options: GrayMatterOption<T>) => string);
    excerpt_separator?: string;
    excerpt_includes?: string;
    engines?: { [index: string]: (input: string) => any };
    language?: string;
    delimiters?: string | [string, string];
    /** Use a custom function to stringify the data. */
    stringify?: (data: T, options?: GrayMatterOption<T>) => string;
  }

  export default function matter<T = any>(
    input: string | Buffer,
    options?: GrayMatterOption<T>
  ): GrayMatterFile<T>;

  function matter(input: string): GrayMatterFile;
  export = matter;
}
