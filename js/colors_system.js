/**
 * 🎨 ICLOTH COLOR REGISTRY - CLEAN SLATE
 * This file is now empty and ready for a new color system initialization.
 */

const ICLOTH_COLORS = [];

/**
 * Global Color Utility Class (Empty Skeleton)
 */
class ColorSystem {
    static get registry() {
        return ICLOTH_COLORS;
    }

    static getRegistry() {
        return ICLOTH_COLORS;
    }

    /**
     * Finds a color by name (Ar/En)
     */
    static findColor(name) {
        if (!name) return null;
        const low = name.toLowerCase().trim();
        return ICLOTH_COLORS.find(c => 
            c.nameAr === name || 
            c.nameEn.toLowerCase() === low
        );
    }

    /**
     * Gets Hex code for a color name
     */
    static getHex(name) {
        const color = this.findColor(name);
        if (color) return color.hex;

        // Fallback: Gray for undefined colors
        return '#888888';
    }

    /**
     * Translates a color name
     */
    static translate(name, targetLang) {
        const color = this.findColor(name);
        if (!color) return name;
        return targetLang === 'ar' ? color.nameAr : color.nameEn;
    }

    /**
     * Sorts a list of color names
     */
    static sortColors(names, method = 'hue', lang = 'ar') {
        // Return as is since registry is empty
        return names;
    }

    /**
     * Search in registry
     */
    static search(query) {
        return [];
    }
}

// Attach to window for global access
window.ColorSystem = ColorSystem;
window.ICLOTH_COLORS = ICLOTH_COLORS;
