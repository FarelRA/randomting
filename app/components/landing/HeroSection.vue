<template>
  <section class="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pt-32">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(45%_30%_at_50%_0%,rgba(99,102,241,0.08),transparent)] dark:bg-[radial-gradient(45%_30%_at_50%_0%,rgba(99,102,241,0.15),transparent)]" />
    <div class="mx-auto max-w-4xl text-center">
      <div class="mb-6 inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300">
        <span class="mr-2 h-2 w-2 rounded-full bg-green-500" />
        22+ free random tools
      </div>
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        <span class="bg-gradient-to-r from-primary-600 to-violet-500 bg-clip-text text-transparent">Random tools</span>
        <br />
        for everything you need
      </h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
        One website, all random tools. No ads, no hopping between sites.
        Roll dice, pick names, generate passwords, spin wheels &mdash; all in one place.
      </p>
      <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <AppButton to="/tools" size="lg">
          Explore Tools
          <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </AppButton>
        <AppButton to="/multiplayer" variant="secondary" size="lg">
          Multiplayer Games
        </AppButton>
      </div>
    </div>
  </section>
</template>
