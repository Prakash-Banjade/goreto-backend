import { nanoid } from 'nanoid'

export function generateSlug(title: string) {
    return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + nanoid()
}