import { defineField, defineType } from 'sanity'

const CATEGORIES = [
  { title: 'Collections', value: 'collections' },
  { title: 'Papers', value: 'papers' },
  { title: 'Stickers', value: 'stickers' },
  { title: 'Tape & Fasteners', value: 'tape' },
  { title: 'Ephemera', value: 'ephemera' },
  { title: 'Florals & Botanicals', value: 'florals' },
  { title: 'Frames & Containers', value: 'frames' },
  { title: 'Writing & Typography', value: 'type' },
  { title: 'Paint & Artistic', value: 'paint' },
  { title: 'Sewing & Fabric', value: 'fabric' },
  { title: 'Photos & Memory', value: 'photos' },
  { title: 'Decorative Details', value: 'details' },
]

export default defineType({
  name: 'item',
  title: 'Shop Item',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'category', type: 'string', options: { list: CATEGORIES } }),
    defineField({ name: 'asset', title: 'Artwork', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'tier',
      type: 'string',
      description: 'free = in everyone’s starter set · catalogue = unlocked by Studio subscription · pack = one-time keepsake purchase (also included with Studio)',
      options: {
        list: [
          { title: 'Free (starter set)', value: 'free' },
          { title: 'Catalogue (Studio subscription)', value: 'catalogue' },
          { title: 'Keepsake pack (one-time purchase)', value: 'pack' },
        ],
      },
      initialValue: 'catalogue',
    }),
    defineField({ name: 'price', type: 'number', hidden: ({ parent }) => parent?.tier === 'free' }),
    defineField({ name: 'publishAt', title: 'Publish at', type: 'datetime' }),
    defineField({ name: 'description', type: 'text', rows: 2 }),
    defineField({ name: 'glyphFallback', title: 'Icon (Feather name)', type: 'string' }),
    defineField({ name: 'tone', type: 'string', description: 'Color tone key e.g. sage, rose, forest' }),
    defineField({ name: 'itemCount', title: 'Item count', type: 'number' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category', media: 'asset' },
  },
})
