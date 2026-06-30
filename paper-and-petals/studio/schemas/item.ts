import { defineField, defineType } from 'sanity'

const CATEGORIES = [
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
      name: 'printAsset',
      title: 'Print artwork (high-res)',
      type: 'image',
      description: 'High-resolution PNG for print download by outright purchasers. Set by the ingest pipeline.',
    }),
    defineField({
      name: 'free',
      title: 'In free tier',
      type: 'boolean',
      description: 'On = part of the fixed free starter set. Paid items are sold only inside collections.',
      initialValue: false,
    }),
    defineField({ name: 'publishAt', title: 'Publish at', type: 'datetime' }),
    defineField({ name: 'description', type: 'text', rows: 2 }),
    defineField({ name: 'glyphFallback', title: 'Icon (Feather name)', type: 'string' }),
    defineField({ name: 'tone', type: 'string', description: 'Color tone key e.g. sage, rose, forest' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category', media: 'asset' },
  },
})
