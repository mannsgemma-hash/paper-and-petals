import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'palette', type: 'string', description: 'Color tone key e.g. rose, forest' }),
    defineField({ name: 'price', type: 'number' }),
    defineField({ name: 'items', type: 'array', of: [{ type: 'reference', to: [{ type: 'item' }] }] }),
    defineField({ name: 'publishAt', title: 'Publish at', type: 'datetime' }),
  ],
  preview: { select: { title: 'name' } },
})
