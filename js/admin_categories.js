// 📁 iCloth Admin - Categories Logic
let categories = [];

async function loadCategories() {
    try {
        const snapshot = await db.collection('categories').orderBy('sortOrder', 'asc').get();
        categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderCategories();
        updateCategoryDropdowns();
    } catch (e) {
        console.error("Load categories error:", e);
    }
}

function renderCategories() {
    const list = document.getElementById('categories-list');
    if (!list) return;
    
    list.innerHTML = categories.map(c => `
        <tr>
            <td>${c.name}</td>
            <td>${c.name_ar}</td>
            <td>${c.parentId ? categories.find(p => p.id === c.parentId)?.name || '---' : '-- رئيسي --'}</td>
            <td>
                <button onclick="editCategory('${c.id}')"><i class="fas fa-edit"></i></button>
                <button onclick="deleteCategory('${c.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function updateCategoryDropdowns() {
    const mainSelects = ['cat-parent', 'p-category', 'admin-product-category-filter'];
    mainSelects.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const currentVal = el.value;
        el.innerHTML = (id === 'cat-parent' ? '<option value="">-- رئيسي --</option>' : (id.includes('filter') ? '<option value="all">كل الأقسام</option>' : '<option disabled selected>اختر قسم...</option>'));
        el.innerHTML += categories.map(c => `<option value="${c.id}">${c.name} (${c.name_ar})</option>`).join('');
        el.value = currentVal;
    });
}

function openCategoryModal(id = null) {
    const modal = document.getElementById('category-modal');
    if (!modal) return;
    if (id) {
        const cat = categories.find(x => x.id === id);
        document.getElementById('cat-id').value = cat.id;
        document.getElementById('cat-name').value = cat.name;
        document.getElementById('cat-name-ar').value = cat.name_ar;
        document.getElementById('cat-parent').value = cat.parentId || "";
        document.getElementById('cat-order').value = cat.sortOrder || "";
        document.getElementById('cat-active').checked = cat.active !== false;
    } else {
        document.getElementById('category-form').reset();
        document.getElementById('cat-id').value = "";
    }
    modal.style.display = 'flex';
}
