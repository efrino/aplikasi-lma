// src/utils/buildMenuTree.ts

export interface RawMenu {
    id: string
    name: string
    path: string | null
    parent_id: string | null
}

export interface MenuItem extends RawMenu {
    children?: MenuItem[]
}

export function buildMenuTree(menuItems: RawMenu[]): MenuItem[] {
    const map = new Map<string, MenuItem>()
    const roots: MenuItem[] = []

    menuItems.forEach((item) => {
        map.set(item.id, { ...item, children: [] })
    })

    for (const item of map.values()) {
        if (item.parent_id) {
            const parent = map.get(item.parent_id)
            if (parent) {
                parent.children!.push(item)
            }
        } else {
            roots.push(item)
        }
    }

    return roots
}
