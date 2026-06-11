<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Multiplayer Lobby</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Join or create a room to play with friends in real-time</p>
      </div>
      <AppButton to="/multiplayer/create">
        Create Room
      </AppButton>
    </div>

    <RoomList />
  </div>
</template>
