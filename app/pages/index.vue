<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: formatPageTitle(t('home.title')),
  description: t('home.description'),
})
</script>

<template>
  <main id="main" class="relative flex min-h-svh items-center overflow-hidden px-6 py-16 sm:px-10">
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        class="absolute top-0 left-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-aurora-500/15 blur-3xl"
      />
      <div
        class="absolute right-0 bottom-0 size-80 translate-x-1/3 translate-y-1/3 rounded-full bg-gold-300/10 blur-3xl"
      />
    </div>

    <section class="relative mx-auto w-full max-w-4xl">
      <p class="text-xs font-medium tracking-[0.32em] text-gold-300 uppercase">
        {{ t('home.eyebrow') }}
      </p>
      <h1
        class="mt-5 max-w-3xl font-serif text-5xl leading-[1.02] tracking-tight text-balance sm:text-7xl"
      >
        {{ t('home.title') }}
      </h1>
      <p class="mt-6 max-w-xl text-base leading-relaxed text-moon-300 sm:text-lg">
        {{ t('home.description') }}
      </p>

      <div class="mt-10 flex flex-wrap items-center gap-3">
        <UButton to="/api/health" target="_blank" icon="i-lucide-activity" size="lg">
          {{ t('home.health') }}
        </UButton>
        <UBadge color="neutral" variant="outline" size="lg">
          {{ t('home.version', { version: useRuntimeConfig().public.appVersion }) }}
        </UBadge>
      </div>

      <dl class="mt-16 grid gap-6 border-t border-white/10 pt-8 text-sm sm:grid-cols-3">
        <div>
          <dt class="text-moon-500">{{ t('home.stack.runtime') }}</dt>
          <dd class="mt-1 text-moon-100">Nuxt 4 · Vue 3 · TypeScript</dd>
        </div>
        <div>
          <dt class="text-moon-500">{{ t('home.stack.ui') }}</dt>
          <dd class="mt-1 text-moon-100">Nuxt UI · Tailwind CSS</dd>
        </div>
        <div>
          <dt class="text-moon-500">{{ t('home.stack.quality') }}</dt>
          <dd class="mt-1 text-moon-100">ESLint · Vitest · Playwright</dd>
        </div>
      </dl>
    </section>
  </main>
</template>
