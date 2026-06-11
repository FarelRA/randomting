<template>
  <ToolsToolWrapper v-if="toolComp && tool" :name="tool.name" :description="tool.description">
    <component :is="toolComp" :key="slug" />
  </ToolsToolWrapper>
  <div v-else class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <CommonAppCard>
      <p class="py-8 text-center text-gray-500 dark:text-gray-400">Tool not found</p>
    </CommonAppCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const tool = computed(() => findTool(slug.value))

const toolComp = computed(() => {
  if (!toolRegistry[slug.value]) return undefined
  return defineAsyncComponent(toolRegistry[slug.value])
})
</script>
