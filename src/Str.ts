/**
 * This class is derived from the code of the Laravel™ Framework (2024-08-24), wich is subject of
 * the MIT License (https://github.com/laravel/framework?tab=MIT-1-ov-file#readme)
 * Copyright (c) 2011-2024 Laravel Holdings Inc. (https://laravel.com/)
 */
class Str {
    /**
     * Make a string's first character uppercase.
     */
    static ucfirst(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    /**
     * Convert the given string to upper-case.
     */
    static upper(string: string): string {
        return string.toUpperCase()
    }
}

export default Str
