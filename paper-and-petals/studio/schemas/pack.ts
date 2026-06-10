import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pack',
  title: 'Daily Pack',
  type: 'document',
  fields: [
    defineField({ name: 'date', type: 'date', validation: r => r.required() }),
    defineField({ name: 'freeParcel', title: 'Free parcel (all users)', type: 'array', of: [{ type: 'reference', to: [{ type: 'item' }] }] }),
    defineField({ name: 'subParcel', title: 'Sub parcel (Cottage members)', type: 'array', of: [{ type: 'reference', to: [{ type: 'item' }] }] }),
  ],
  preview: { select: { title: 'date' } },
})
