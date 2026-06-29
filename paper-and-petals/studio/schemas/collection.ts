import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'cover', title: 'Cover artwork', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'palette', type: 'string', description: 'Color tone key e.g. rose, forest' }),
    defineField({
      name: 'free',
      title: 'Free collection',
      type: 'boolean',
      description: 'On = part of the free tier (price ignored).',
      initialValue: false,
    }),
    defineField({
      name: 'price',
      type: 'number',
      description: 'One-time price. Ignored when Free is on.',
      hidden: ({ parent }) => parent?.free === true,
    }),
    defineField({
      name: 'whatYouGet',
      title: 'What you get',
      type: 'text',
      rows: 3,
      description: 'Short description shown on the collection detail panel.',
    }),
    defineField({
      name: 'items',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'item' }] }],
      validation: r => r.required().min(1),
    }),
    defineField({ name: 'publishAt', title: 'Publish at', type: 'datetime' }),
  ],
  preview: { select: { title: 'name', subtitle: 'palette', media: 'cover' } },
})
