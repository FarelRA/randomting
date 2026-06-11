<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">{{ title }}</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ description }}</p>
      </div>
      <CommonAppButton @click="openCreate">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
        Add {{ itemName }}
      </CommonAppButton>
    </div>

    <div v-if="loading" class="space-y-4">
      <CommonLoadingSkeleton v-for="i in 5" :key="i" lines="1" :widths="['100%']" />
    </div>

    <div v-else-if="items.length === 0" class="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
      <p class="text-gray-500 dark:text-gray-400">No {{ itemName.toLowerCase() }}s found. Add one to get started.</p>
    </div>

    <div v-else class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table class="w-full text-sm">
        <thead class="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
          <tr>
            <th class="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Content</th>
            <th v-if="showAuthor" class="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Author</th>
            <th class="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Category</th>
            <th class="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Active</th>
            <th class="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-900/50">
            <td class="max-w-xs truncate px-4 py-3">{{ item.content }}</td>
            <td v-if="showAuthor" class="px-4 py-3">{{ item.author }}</td>
            <td class="px-4 py-3">
              <span class="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">{{ item.category }}</span>
            </td>
            <td class="px-4 py-3">
              <button
                class="inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                :class="item.active ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'"
                role="switch"
                :aria-checked="!!item.active"
                :aria-label="`Toggle ${itemName.toLowerCase()} active status`"
                @click="toggleActive(item)"
              >
                <span class="inline-block h-4 w-4 translate-x-0.5 transform rounded-full bg-white transition-transform" :class="item.active ? 'translate-x-5.5' : ''" />
              </button>
            </td>
            <td class="px-4 py-3 text-right">
              <CommonAppButton variant="ghost" size="sm" @click="openEdit(item)">Edit</CommonAppButton>
              <CommonAppButton variant="ghost" size="sm" class="text-red-500 hover:text-red-700 dark:hover:text-red-400" @click="confirmDelete(item)">Delete</CommonAppButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <CommonAppModal :open="modalOpen" :title="editing ? `Edit ${itemName}` : `Add ${itemName}`" @close="closeModal">
      <form class="space-y-4" @submit.prevent="save">
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
          <textarea v-model="form.content" rows="3" class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" required />
        </div>
        <div v-if="showAuthor" class="space-y-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
          <input v-model="form.author" class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" required />
        </div>
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select v-model="form.category" class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Source (optional)</label>
          <input v-model="form.source" class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
        </div>
        <p v-if="saveError" class="text-sm text-red-500">{{ saveError }}</p>
        <div class="flex justify-end gap-2">
          <CommonAppButton type="button" variant="secondary" @click="closeModal">Cancel</CommonAppButton>
          <CommonAppButton type="submit" :disabled="saving">{{ editing ? 'Update' : 'Add' }}</CommonAppButton>
        </div>
      </form>
    </CommonAppModal>

    <CommonAppModal :open="deleteModalOpen" title="Confirm Delete" @close="deleteModalOpen = false">
      <p class="text-sm text-gray-600 dark:text-gray-400">Are you sure you want to delete this {{ itemName.toLowerCase() }}? This action cannot be undone.</p>
      <div class="mt-4 flex justify-end gap-2">
        <CommonAppButton variant="secondary" @click="deleteModalOpen = false">Cancel</CommonAppButton>
        <CommonAppButton variant="danger" :disabled="deleting" @click="doDelete">Delete</CommonAppButton>
      </div>
    </CommonAppModal>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  description: string
  itemName: string
  apiBase: string
  showAuthor?: boolean
  categories?: string[]
}>(), {
  categories: () => ['general', 'programming', 'science', 'history', 'animal', 'technology', 'dad', 'puns'],
  showAuthor: false,
})

const items = ref<any[]>([])
const loading = ref(true)
const modalOpen = ref(false)
const deleteModalOpen = ref(false)
const editing = ref<any | null>(null)
const saving = ref(false)
const deleting = ref(false)
const saveError = ref('')
const deleteTarget = ref<any | null>(null)

const form = reactive({
  content: '',
  author: '',
  category: 'general',
  source: '',
})

function resetForm() {
  form.content = ''
  form.author = ''
  form.category = 'general'
  form.source = ''
}

async function fetchItems() {
  loading.value = true
  try {
    items.value = await $fetch(`${props.apiBase}/all`)
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editing.value = null
  resetForm()
  modalOpen.value = true
}

function openEdit(item: any) {
  editing.value = item
  form.content = item.content
  form.author = item.author || ''
  form.category = item.category || 'general'
  form.source = item.source || ''
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  editing.value = null
  resetForm()
  saveError.value = ''
}

async function save() {
  saving.value = true
  saveError.value = ''
  try {
    if (editing.value) {
      await $fetch(`${props.apiBase}/${editing.value.id}`, {
        method: 'PUT',
        body: { content: form.content, author: form.author, category: form.category, source: form.source, active: editing.value.active },
      })
    } else {
      await $fetch(props.apiBase, {
        method: 'POST',
        body: { content: form.content, author: form.author, category: form.category, source: form.source },
      })
    }
    closeModal()
    await fetchItems()
  } catch (e: any) {
    saveError.value = e?.data?.message || 'Failed to save'
  } finally {
    saving.value = false
  }
}

async function toggleActive(item: any) {
  try {
    await $fetch(`${props.apiBase}/${item.id}`, {
      method: 'PUT',
      body: { content: item.content, author: item.author, category: item.category, source: item.source, active: item.active ? 0 : 1 },
    })
    await fetchItems()
  } catch {}
}

function confirmDelete(item: any) {
  deleteTarget.value = item
  deleteModalOpen.value = true
}

async function doDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await $fetch(`${props.apiBase}/${deleteTarget.value.id}`, { method: 'DELETE' })
    deleteModalOpen.value = false
    deleteTarget.value = null
    await fetchItems()
  } catch {
  } finally {
    deleting.value = false
  }
}

onMounted(fetchItems)
</script>
