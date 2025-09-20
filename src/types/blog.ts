// F:\Shahrivar1404\Werch_app\werchaui\src\types\blog.ts


export type BlogCategory = {
  id: number; name: string; slug: string; description?: string;
};

export type BlogReference = {
  id: string | number;
  title: string;
  url: string;
  authors_text?: string;
  year?: string;
  source?: string;
  abstract?: string; // برای Tooltip/Modal
  notes?: string;
};

export type BlogPostList = {
  id: number; title: string; slug: string;
  excerpt?: string;
  cover?: string | null;
  category?: BlogCategory | null;
  reading_time_min?: number;
  published_at?: string | null;
  is_featured?: boolean;
  seo_title?: string; meta_description?: string;
};

export type BlogPostDetail = BlogPostList & {
  content_html: string;
  references: BlogReference[];
};
