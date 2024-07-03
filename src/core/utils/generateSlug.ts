import { nanoid } from 'nanoid'

export function generateSlug(title: string, id: boolean = true) {
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

    return id ? `${slug}-${nanoid()}` : slug
}