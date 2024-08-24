/**
 * Get an item from an array or object using "dot" notation.
 *
 * The data_get function is derived from the code of the Laravel™ Framework (2024-08-24), wich is
 * subject of the MIT License (https://github.com/laravel/framework?tab=MIT-1-ov-file#readme)
 * Copyright (c) 2011-2024 Laravel Holdings Inc. (https://laravel.com/)
 */
export function data_get(obj: object, path: string | number, fallback = null) {
    if (Number.isInteger(path)) {
        path = path.toString()
    }

    path = <string>path

    let properties = Array.isArray(path) ? path : path.split('.')
    let value = properties.reduce((prev, curr) => {
        return prev && prev[curr]
    }, obj)

    return value !== undefined ? value : fallback
}
