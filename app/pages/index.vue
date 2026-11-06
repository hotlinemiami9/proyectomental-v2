<script setup lang="ts">
import { typeLabels } from '~/data/chart-labels'
import { typeContent } from '~/data/interpretations'

const { t } = useI18n()

useSeoMeta({
  title: formatPageTitle('Tu carta de Diseño Humano'),
  description:
    'Calcula tu carta de Diseño Humano con tus datos de nacimiento. Sin registro obligatorio y con una lectura clara para empezar.',
})

const types = Object.entries(typeContent)
</script>

<template>
  <div class="relative isolate overflow-hidden bg-night-950">
    <StarfieldSky />
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(ellipse_at_top,rgba(242,212,143,0.1),transparent_65%)]"
    />
    <div class="relative z-10 mx-auto w-full max-w-6xl px-5 pt-6 pb-20 sm:px-8 sm:pt-8">
      <SiteHeader />

      <section
        class="grid items-start gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,29rem)] lg:gap-14 lg:pt-16"
      >
        <div class="lg:pt-24">
          <p class="text-[11px] tracking-[0.32em] text-gold-300 uppercase">
            {{ t('home.eyebrow') }}
          </p>
          <h1
            class="mt-5 max-w-[18ch] font-serif text-[clamp(2.6rem,5.2vw,4.6rem)] leading-[0.9] font-medium tracking-[-0.04em] text-balance"
          >
            Proyecto mental:
            <br />
            <span class="text-moon-500 italic">para mentes inquietas</span>
          </h1>
          <p class="mt-7 max-w-md text-base leading-relaxed text-moon-300 sm:text-lg">
            Tres datos del instante en que naciste. Una forma más clara de empezar a explorar tu
            Diseño Humano.
          </p>
          <div class="mt-8 flex flex-wrap gap-2 text-xs text-moon-300">
            <span class="rounded-full border border-white/10 px-3 py-1.5"
              >Sin registro obligatorio</span
            >
            <span class="rounded-full border border-white/10 px-3 py-1.5"
              >Datos guardados en tu dispositivo</span
            >
            <span class="rounded-full border border-white/10 px-3 py-1.5">Español</span>
          </div>
        </div>

        <div class="relative">
          <div
            class="pointer-events-none absolute -inset-x-6 -inset-y-8 z-0 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(7,9,19,0.82),transparent_70%)]"
          />
          <div class="relative z-10">
            <BirthForm />
          </div>
        </div>
      </section>

      <section id="explora" class="mt-28 border-t border-white/10 pt-12">
        <div class="max-w-2xl">
          <p class="text-[11px] tracking-[0.24em] text-gold-300 uppercase">Después de la carta</p>
          <h2 class="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
            Una lectura para volver a ti.
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-moon-300 sm:text-base">
            La carta no es una etiqueta. Es un mapa para observar cómo respondes, cómo decides y qué
            energía te sostiene.
          </p>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <article
            v-for="([key, content], index) in types"
            :key="key"
            class="group rounded-2xl border border-white/10 bg-night-950/55 p-5 backdrop-blur-[2px] transition-colors hover:border-gold-300/40"
          >
            <span class="text-[11px] tracking-[0.2em] text-moon-500 uppercase"
              >0{{ index + 1 }}</span
            >
            <h3 class="mt-4 font-serif text-2xl">{{ typeLabels[key] ?? key }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-moon-300">{{ content.title }}</p>
          </article>
        </div>
      </section>

      <section class="mt-24 grid gap-6 border-t border-white/10 pt-12 md:grid-cols-3">
        <div>
          <p class="text-[11px] tracking-[0.2em] text-gold-300 uppercase">01</p>
          <h3 class="mt-3 font-serif text-2xl">Tus datos</h3>
          <p class="mt-2 text-sm leading-relaxed text-moon-300">
            Nombre, fecha, hora y lugar de nacimiento.
          </p>
        </div>
        <div>
          <p class="text-[11px] tracking-[0.2em] text-gold-300 uppercase">02</p>
          <h3 class="mt-3 font-serif text-2xl">Tu carta</h3>
          <p class="mt-2 text-sm leading-relaxed text-moon-300">
            Centros, canales, puertas y una lectura esencial.
          </p>
        </div>
        <div>
          <p class="text-[11px] tracking-[0.2em] text-gold-300 uppercase">03</p>
          <h3 class="mt-3 font-serif text-2xl">Tu tiempo</h3>
          <p class="mt-2 text-sm leading-relaxed text-moon-300">
            Guarda, compara y vuelve cuando lo necesites.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
