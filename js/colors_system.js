/**
 * iCloth Color System - Centralized Registry
 * Handles Hex codes, Translations, and Shade-based sorting.
 */

const ICLOTH_COLORS = [
    // --- المحايد (Neutrals) ---
    { nameAr: "أسود", nameEn: "Black", hex: "#000000", hue: 0, group: "neutral" },
    { nameAr: "أبيض", nameEn: "White", hex: "#FFFFFF", hue: 0, group: "neutral" },
    { nameAr: "أوف وايت", nameEn: "Off-White", hex: "#F5F5F5", hue: 0, group: "neutral" },
    { nameAr: "رمادي", nameEn: "Grey", hex: "#808080", hue: 0, group: "neutral" },
    { nameAr: "رصاصي", nameEn: "Grey", hex: "#A9A9A9", hue: 0, group: "neutral" },
    { nameAr: "رمادي فاتح", nameEn: "Light Grey", hex: "#D3D3D3", hue: 0, group: "neutral" },
    { nameAr: "رمادي غامق", nameEn: "Dark Grey", hex: "#555555", hue: 0, group: "neutral" },
    { nameAr: "فحمي", nameEn: "Charcoal", hex: "#36454F", hue: 0, group: "neutral" },
    { nameAr: "أردوازي", nameEn: "Slate", hex: "#708090", hue: 210, group: "neutral" },
    { nameAr: "فضي", nameEn: "Silver", hex: "#C0C0C0", hue: 0, group: "neutral" },
    { nameAr: "بلاتيني", nameEn: "Platinum", hex: "#E5E4E2", hue: 0, group: "neutral" },
    { nameAr: "لؤلؤي", nameEn: "Pearl", hex: "#F0EAD6", hue: 45, group: "neutral" },
    { nameAr: "عظمي", nameEn: "Bone", hex: "#E3DAC9", hue: 40, group: "neutral" },
    { nameAr: "إيكرو", nameEn: "Ecru", hex: "#C2B280", hue: 45, group: "neutral" },
    { nameAr: "كتان", nameEn: "Linen", hex: "#FAF0E6", hue: 30, group: "neutral" },
    { nameAr: "شوفان", nameEn: "Oatmeal", hex: "#E5D2B8", hue: 35, group: "neutral" },
    { nameAr: "حصوي", nameEn: "Pebble", hex: "#B8B3AD", hue: 35, group: "neutral" },
    { nameAr: "حجري", nameEn: "Stone", hex: "#8B8680", hue: 30, group: "neutral" },

    // --- الأحمر والخمري (Reds & Burgundies) ---
    { nameAr: "أحمر", nameEn: "Red", hex: "#FF0000", hue: 0, group: "red" },
    { nameAr: "أحمر ناري", nameEn: "Fire Red", hex: "#E25822", hue: 15, group: "red" },
    { nameAr: "أحمر ياقوتي", nameEn: "Ruby Red", hex: "#E0115F", hue: 340, group: "red" },
    { nameAr: "نبيتي", nameEn: "Burgundy", hex: "#800000", hue: 0, group: "red" },
    { nameAr: "خمري", nameEn: "Wine", hex: "#722F37", hue: 350, group: "red" },
    { nameAr: "كرزي", nameEn: "Cherry", hex: "#D2042D", hue: 350, group: "red" },
    { nameAr: "طوبي", nameEn: "Brick", hex: "#B22222", hue: 5, group: "red" },
    { nameAr: "قرمزي", nameEn: "Crimson", hex: "#DC143C", hue: 350, group: "red" },
    { nameAr: "مارون", nameEn: "Maroon", hex: "#800000", hue: 0, group: "red" },
    { nameAr: "تيراكوتا", nameEn: "Terracotta", hex: "#E2725B", hue: 10, group: "red" },
    { nameAr: "دم الغزال", nameEn: "Oxblood", hex: "#4A0404", hue: 0, group: "red" },
    { nameAr: "ياقوتي غامق", nameEn: "Deep Ruby", hex: "#841B2D", hue: 350, group: "red" },

    // --- الوردي (Pinks) ---
    { nameAr: "وردي", nameEn: "Pink", hex: "#FFC0CB", hue: 350, group: "pink" },
    { nameAr: "وردي فاتح", nameEn: "Light Pink", hex: "#FFB6C1", hue: 350, group: "pink" },
    { nameAr: "وردي غامق", nameEn: "Deep Pink", hex: "#FF1493", hue: 330, group: "pink" },
    { nameAr: "بينك", nameEn: "Pink", hex: "#FF69B4", hue: 330, group: "pink" },
    { nameAr: "فوشيا", nameEn: "Fuchsia", hex: "#FF00FF", hue: 300, group: "pink" },
    { nameAr: "وردي مطفي", nameEn: "Dusty Rose", hex: "#C08081", hue: 355, group: "pink" },
    { nameAr: "سيمون", nameEn: "Salmon", hex: "#FA8072", hue: 15, group: "pink" },
    { nameAr: "مرجاني", nameEn: "Coral", hex: "#FF7F50", hue: 15, group: "red" },
    { nameAr: "خوخي", nameEn: "Peach", hex: "#FFDAB9", hue: 30, group: "pink" },
    { nameAr: "مشمشي", nameEn: "Apricot", hex: "#FBCEB1", hue: 25, group: "pink" },
    { nameAr: "وردي خجول", nameEn: "Blush", hex: "#DE5D83", hue: 340, group: "pink" },
    { nameAr: "وردي لؤلؤي", nameEn: "Peachy Pink", hex: "#F9CCCA", hue: 5, group: "pink" },

    // --- البرتقالي والأصفر (Oranges & Yellows) ---
    { nameAr: "برتقالي", nameEn: "Orange", hex: "#FFA500", hue: 30, group: "orange" },
    { nameAr: "برتقالي هادئ", nameEn: "Soft Orange", hex: "#FFCC99", hue: 30, group: "orange" },
    { nameAr: "نحاسي", nameEn: "Copper", hex: "#B87333", hue: 20, group: "orange" },
    { nameAr: "يقطيني", nameEn: "Pumpkin", hex: "#FF7518", hue: 25, group: "orange" },
    { nameAr: "أصفر", nameEn: "Yellow", hex: "#FFFF00", hue: 60, group: "yellow" },
    { nameAr: "أصفر ليموني", nameEn: "Lemon Yellow", hex: "#FFF700", hue: 60, group: "yellow" },
    { nameAr: "أصفر كناري", nameEn: "Canary Yellow", hex: "#FFEF00", hue: 55, group: "yellow" },
    { nameAr: "مستردة", nameEn: "Mustard", hex: "#FFDB58", hue: 50, group: "yellow" },
    { nameAr: "ذهبي", nameEn: "Gold", hex: "#D4AF37", hue: 45, group: "yellow" },
    { nameAr: "عسلي", nameEn: "Amber", hex: "#FFBF00", hue: 45, group: "yellow" },
    { nameAr: "عسل", nameEn: "Honey", hex: "#EBA937", hue: 40, group: "yellow" },
    { nameAr: "كريمة", nameEn: "Cream", hex: "#FFFDD0", hue: 60, group: "yellow" },
    { nameAr: "سكري", nameEn: "Creamy", hex: "#F5F5DC", hue: 60, group: "yellow" },

    // --- البني والترابي (Brows & Earth Tones) ---
    { nameAr: "بني", nameEn: "Brown", hex: "#5C4033", hue: 15, group: "brown" },
    { nameAr: "بني فاتح", nameEn: "Light Brown", hex: "#964B00", hue: 30, group: "brown" },
    { nameAr: "بني غامق", nameEn: "Dark Brown", hex: "#3D2B1F", hue: 20, group: "brown" },
    { nameAr: "شوكولاتة", nameEn: "Chocolate", hex: "#D2691E", hue: 25, group: "brown" },
    { nameAr: "كاكاو", nameEn: "Cocoa", hex: "#D2691E", hue: 25, group: "brown" },
    { nameAr: "قهوة", nameEn: "Coffee", hex: "#6F4E37", hue: 25, group: "brown" },
    { nameAr: "موكاتينو", nameEn: "Mocha", hex: "#967969", hue: 15, group: "brown" },
    { nameAr: "هافان", nameEn: "Havana", hex: "#8B4513", hue: 25, group: "brown" },
    { nameAr: "جملي", nameEn: "Camel", hex: "#C19A6B", hue: 35, group: "brown" },
    { nameAr: "كافيه", nameEn: "Cafe", hex: "#D2B48C", hue: 35, group: "brown" },
    { nameAr: "بيج", nameEn: "Beige", hex: "#F5F5DC", hue: 60, group: "brown" },
    { nameAr: "بيج رملي", nameEn: "Sand Beige", hex: "#E3D5B8", hue: 45, group: "brown" },
    { nameAr: "رملي", nameEn: "Sand", hex: "#C2B280", hue: 45, group: "brown" },
    { nameAr: "طحيني", nameEn: "Tahini", hex: "#E3D5B8", hue: 40, group: "brown" },
    { nameAr: "برونزي", nameEn: "Bronze", hex: "#CD7F32", hue: 30, group: "brown" },
    { nameAr: "توب", nameEn: "Taupe", hex: "#483C32", hue: 30, group: "brown" },
    { nameAr: "جوز", nameEn: "Walnut", hex: "#773915", hue: 20, group: "brown" },
    { nameAr: "خشب", nameEn: "Wood", hex: "#906E4E", hue: 30, group: "brown" },

    // --- الأزرق والدنيم (Blues & Denim) ---
    { nameAr: "كحلي", nameEn: "Navy", hex: "#000080", hue: 240, group: "blue" },
    { nameAr: "أزرق", nameEn: "Blue", hex: "#0000FF", hue: 240, group: "blue" },
    { nameAr: "أزرق ملكي", nameEn: "Royal Blue", hex: "#4169E1", hue: 225, group: "blue" },
    { nameAr: "أزرق ليلي", nameEn: "Night Blue", hex: "#191970", hue: 240, group: "blue" },
    { nameAr: "أزرق سماوي", nameEn: "Sky Blue", hex: "#87CEEB", hue: 200, group: "blue" },
    { nameAr: "لبني", nameEn: "Light Blue", hex: "#ADD8E6", hue: 195, group: "blue" },
    { nameAr: "أزرق فاتح", nameEn: "Pale Blue", hex: "#AFDBF5", hue: 200, group: "blue" },
    { nameAr: "بيبي بلو", nameEn: "Baby Blue", hex: "#89CFF0", hue: 200, group: "blue" },
    { nameAr: "أزرق فيروزي", nameEn: "Turquoise Blue", hex: "#00FFEF", hue: 175, group: "blue" },
    { nameAr: "تركواز", nameEn: "Turquoise", hex: "#40E0D0", hue: 175, group: "blue" },
    { nameAr: "سياان", nameEn: "Cyan", hex: "#00FFFF", hue: 180, group: "blue" },
    { nameAr: "بترولي", nameEn: "Petrol", hex: "#005F6B", hue: 185, group: "blue" },
    { nameAr: "بترولي غامق", nameEn: "Dark Petrol", hex: "#003344", hue: 190, group: "blue" },
    { nameAr: "جنزاري", nameEn: "Teal", hex: "#008080", hue: 180, group: "blue" },
    { nameAr: "ستيل", nameEn: "Steel Blue", hex: "#4682B4", hue: 210, group: "blue" },
    { nameAr: "دنيم", nameEn: "Denim", hex: "#1560BD", hue: 215, group: "blue" },
    { nameAr: "جينز", nameEn: "Jeans Blue", hex: "#5D76CB", hue: 225, group: "blue" },
    { nameAr: "تلجي", nameEn: "Ice Blue", hex: "#F0F8FF", hue: 210, group: "blue" },
    { nameAr: "أزرق ياقوتي", nameEn: "Sapphire Blue", hex: "#0F52BA", hue: 220, group: "blue" },

    // --- الأخضر والطبيعة (Greens) ---
    { nameAr: "أخضر", nameEn: "Green", hex: "#008000", hue: 120, group: "green" },
    { nameAr: "أخضر غامق", nameEn: "Dark Green", hex: "#006400", hue: 120, group: "green" },
    { nameAr: "أخضر فاتح", nameEn: "Light Green", hex: "#90EE90", hue: 120, group: "green" },
    { nameAr: "أخضر تفاحي", nameEn: "Apple Green", hex: "#8DB600", hue: 75, group: "green" },
    { nameAr: "زيتي", nameEn: "Olive", hex: "#4B5320", hue: 70, group: "green" },
    { nameAr: "زيتوني", nameEn: "Olive Drab", hex: "#808000", hue: 60, group: "green" },
    { nameAr: "بستاج", nameEn: "Pistachio", hex: "#93C572", hue: 100, group: "green" },
    { nameAr: "فستقي", nameEn: "Pistachio", hex: "#93C572", hue: 100, group: "green" },
    { nameAr: "مينت جرين", nameEn: "Mint Green", hex: "#98FF98", hue: 140, group: "green" },
    { nameAr: "أخضر نعناعي", nameEn: "Mint", hex: "#3EB489", hue: 160, group: "green" },
    { nameAr: "أخضر ميرمية", nameEn: "Sage Green", hex: "#9C9F84", hue: 65, group: "green" },
    { nameAr: "أخضر غابة", nameEn: "Forest Green", hex: "#228B22", hue: 120, group: "green" },
    { nameAr: "أخضر بحري", nameEn: "Sea Green", hex: "#2E8B57", hue: 150, group: "green" },
    { nameAr: "فسفوري", nameEn: "Neon Green", hex: "#39FF14", hue: 120, group: "green" },
    { nameAr: "زمردي", nameEn: "Emerald", hex: "#50C878", hue: 140, group: "green" },
    { nameAr: "جوز هند", nameEn: "Coconut", hex: "#965A3E", hue: 20, group: "green" },
    { nameAr: "طحلبي", nameEn: "Moss Green", hex: "#8A9A5B", hue: 80, group: "green" },

    // --- البنفسجي والأوركيد (Purples) ---
    { nameAr: "بنفسجي", nameEn: "Purple", hex: "#800080", hue: 300, group: "purple" },
    { nameAr: "بنفسجي غامق", nameEn: "Deep Purple", hex: "#4B0082", hue: 275, group: "purple" },
    { nameAr: "أرجواني", nameEn: "Violet", hex: "#8A2BE2", hue: 275, group: "purple" },
    { nameAr: "موف", nameEn: "Mauve", hex: "#E0B0FF", hue: 280, group: "purple" },
    { nameAr: "موف غامق", nameEn: "Dark Mauve", hex: "#9932CC", hue: 280, group: "purple" },
    { nameAr: "ليلكي", nameEn: "Lilac", hex: "#C8A2C8", hue: 300, group: "purple" },
    { nameAr: "لافندر", nameEn: "Lavender", hex: "#E6E6FA", hue: 250, group: "purple" },
    { nameAr: "باذنجاني", nameEn: "Eggplant", hex: "#311432", hue: 300, group: "purple" },
    { nameAr: "برقوقي", nameEn: "Plum", hex: "#8E4585", hue: 300, group: "purple" },
    { nameAr: "توتي", nameEn: "Berry", hex: "#8B0000", hue: 350, group: "red" },
    { nameAr: "عنابي", nameEn: "Maroon", hex: "#800000", hue: 0, group: "red" },
    { nameAr: "أوركيد", nameEn: "Orchid", hex: "#DA70D6", hue: 300, group: "purple" },
    { nameAr: "بنفسجي فاتح", nameEn: "Light Purple", hex: "#B19CD9", hue: 260, group: "purple" }
];

/**
 * Global Color Utility Class
 */
class ColorSystem {
    static getRegistry() {
        return ICLOTH_COLORS;
    }

    /**
     * Finds a color object by name (Arabic or English)
     */
    static findColor(name) {
        if (!name) return null;
        const lowName = name.toLowerCase().trim();
        return ICLOTH_COLORS.find(c => 
            c.nameAr.toLowerCase() === lowName || 
            c.nameEn.toLowerCase() === lowName ||
            lowName.includes(c.nameAr.toLowerCase()) ||
            lowName.includes(c.nameEn.toLowerCase())
        );
    }

    /**
     * Gets Hex code for a name, with fallback to hash
     */
    static getHex(name) {
        const color = this.findColor(name);
        if (color) return color.hex;

        // Fallback: Hash-based color
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        const h = Math.abs(hash) % 360;
        return `hsl(${h}, 55%, 45%)`;
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
     * Sorts a list of color names based on Hue (Grade) or Alphabet
     */
    static sortColors(names, method = 'hue', lang = 'ar') {
        const objects = names.map(name => {
            const registryItem = this.findColor(name);
            return {
                original: name,
                item: registryItem || { nameAr: name, nameEn: name, hue: 999, hex: '#888' }
            };
        });

        objects.sort((a, b) => {
            if (method === 'hue') {
                return a.item.hue - b.item.hue;
            } else {
                const nameA = lang === 'ar' ? a.item.nameAr : a.item.nameEn;
                const nameB = lang === 'ar' ? b.item.nameAr : b.item.nameEn;
                return nameA.localeCompare(nameB, lang === 'ar' ? 'ar' : 'en');
            }
        });

        return objects.map(o => o.original);
    }

    /**
     * Search in registry (for Admin/Frontend search)
     */
    static search(query) {
        if (!query) return ICLOTH_COLORS;
        const low = query.toLowerCase();
        return ICLOTH_COLORS.filter(c => 
            c.nameAr.includes(low) || 
            c.nameEn.toLowerCase().includes(low)
        );
    }
}

// Attach to window for global access
window.ColorSystem = ColorSystem;
