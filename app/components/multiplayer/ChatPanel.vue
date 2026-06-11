<template>
  <div class="flex h-full flex-col">
    <div class="mb-2">
      <h3 class="font-semibold">Chat</h3>
    </div>

    <div ref="chatContainer" class="flex-1 space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/30" style="max-height: 300px;">
      <div v-for="(msg, i) in messages" :key="i" class="text-sm">
        <span class="font-medium" :class="msg.userId === myId ? 'text-primary-600 dark:text-primary-400' : ''">
          {{ msg.username }}:
        </span>
        <span class="text-gray-700 dark:text-gray-300">{{ msg.text }}</span>
        <span class="ml-2 text-xs text-gray-400">{{ formatTime(msg.timestamp) }}</span>
      </div>
      <div v-if="messages.length === 0" class="py-8 text-center text-sm text-gray-400">
        No messages yet
      </div>
    </div>

    <form class="mt-2 flex gap-2" @submit.prevent="send">
      <input
        v-model="input"
        type="text"
        placeholder="Type a message..."
        class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        maxlength="500"
      />
      <CommonAppButton type="submit" size="sm" :disabled="!input.trim()">
        Send
      </CommonAppButton>
    </form>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  messages: Array<{ userId: string; username: string; text: string; timestamp: number }>
  myId: string | undefined
}>()

const emit = defineEmits<{
  send: [text: string]
}>()

const input = ref('')
const chatContainer = ref<HTMLElement | null>(null)

watch(() => props.messages.length, () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
})

function formatTime(ts: number) {
  const d = new Date(ts)
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

function send() {
  if (!input.value.trim()) return
  emit('send', input.value.trim())
  input.value = ''
}
</script>
