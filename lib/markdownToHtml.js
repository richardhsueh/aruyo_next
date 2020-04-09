import remark from 'remark'
import html from 'remark-html'
import emoji from 'remark-emoji';
import images from 'remark-images';

export default async function markdownToHtml(markdown) {
  const result = await remark()
    .use(html)
    .use(emoji)
    .use(images)
    .process(markdown)
  return result.toString()
}