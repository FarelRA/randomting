<template>
  <div class="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mb-8">
      <NuxtLink to="/multiplayer" class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        &larr; Back to Lobby
      </NuxtLink>
      <h1 class="mt-2 text-3xl font-bold">Create a Room</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Set up a multiplayer room for you and your friends</p>
    </div>

    <MultiplayerCreateRoomForm />
  </div>
</template>
