import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'feedback',
  title: 'Feedback',
  type: 'document',
  fields: [
    defineField({ name: 'type', type: 'string', options: { list: ['idea','bug','love'] } }),
    defineField({ name: 'message', type: 'text' }),
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'createdAt', type: 'datetime', initialValue: () => new Date().toISOString() }),
    defineField({ name: 'read', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'type', subtitle: 'message' } },
})
