import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: '庄谷 (charmlynn) - 博客',
    description: '庄谷 (charmlynn) 的个人博客：专注 AI 思考、Local-first 产品开发与独立软件构建。',
    site: context.site || 'https://charmlynn.github.io',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>zh-CN</language>`,
  });
}
