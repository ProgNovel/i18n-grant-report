<!-- <svelte:options tag="i18n-widget" /> -->
<script lang="ts">
  import { onMount, tick } from "svelte";
  import { translate } from "$lib/utils/translate";
  import { getCountryFlagUrl, getFlagEmoji } from "$lib/utils/flags";
  import { googleLanguageSupport } from "$lib/utils/languages/google-list";
  import { countriesList } from "$lib/utils/languages/country-list";
  import { windowLock, windowUnlock } from "$lib/utils/user-interface";

  export let type: "article" | "small" = "article";
  export let querySelector = "*";
  export let backend = `${
    import.meta.env.VITE_TRANSLATION_WORKER
      ? new URL(import.meta.env.VITE_TRANSLATION_WORKER)?.origin
      : "http://localhost:8075"
  }/translate`;
  export let lang = "";
  export let engine: "chatgpt" | "google" = "google";
  let customLang = false;

  let containerEl: HTMLElement;
  let googleLangs = Object.keys(googleLanguageSupport);
  let countryCode = Object.keys(countriesList);
  let isLangPickerOpen = false;
  let langFilter: string = "";
  let filterEl: HTMLInputElement;
  let pickLangEl: HTMLElement;
  let isTranslating: boolean = false;

  $: translateLabel = isTranslating
    ? "Translating..."
    : `translate to ${getFlagEmoji(lang || "us")}`;
  $: langs = engine === "google" ? googleLangs : countryCode;
  $: filteredLangs = langs.filter((lg: string) => {
    const countryName =
      engine === "google"
        ? googleLanguageSupport[lg]
        : countriesList[lg].countryName;
    return countryName.toLowerCase().startsWith(langFilter.toLowerCase());
  });

  function pickLang(lg: string) {
    lang = lg;
    customLang = true;

    isLangPickerOpen = false;
  }

  async function showLangPicker() {
    isLangPickerOpen = true;
    await tick();
    // windowLock(pickLangEl);
    filterEl.focus();
  }

  async function fireTranslation() {
    isTranslating = true;
    try {
      await translate(containerEl, querySelector, {
        endpoint: backend,
        lang,
        customLang,
      });
    } catch (error) {
    } finally {
      isTranslating = false;
    }
  }

  onMount(() => {});
</script>

<section class="i18n-widget i18n-container" bind:this={containerEl}>
  {#if isLangPickerOpen}
    <div bind:this={pickLangEl} class="pick-lang i18n-widget">
      <div class="flex i18n-widget">
        <h1 class="i18n-widget">🌎 Select translation target language</h1>
        <input
          bind:value={langFilter}
          type="text"
          name="Lang picker"
          id="lang-picker-filter"
          placeholder="Filter language..."
          bind:this={filterEl}
        />
        {#if filteredLangs?.length}
          {#each filteredLangs as country}
            <span
              class="language i18n-widget"
              on:keyup
              on:click={() => pickLang(country)}
            >
              {getFlagEmoji(country || "us")}
              {engine === "google"
                ? googleLanguageSupport[country]
                : countriesList[country].countryName}
            </span>
          {/each}
        {:else}
          <span class="i18n-widget">no language found.</span>
        {/if}
      </div>
      <div
        class="overlay"
        on:keyup
        on:click={() => {
          isLangPickerOpen = false;
          // windowUnlock();
        }}
      />
    </div>
  {/if}
  <div class="i18n-widget i18n-ui">
    <div on:focus={showLangPicker} tabindex="-1" class="i18n-pick i18n-widget">
      🌎
    </div>
    <button class="{type} i18n-widget" on:keyup on:click={fireTranslation}>
      {translateLabel}
    </button>
  </div>
</section>

<style lang="scss">
  .i18n-container {
    // display: flex;
    position: relative;

    .pick-lang {
      position: relative;
      isolation: isolate;
      z-index: 99999999;
      h1 {
        position: absolute;
        left: 0;
        top: -1.5em;
        font-size: 2.2em;
        color: rgba(255, 255, 255, 1);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
          sans-serif;
      }

      input {
        padding: 0 0.25em;
      }
      .flex {
        flex-wrap: wrap;
        flex-direction: row;
        position: fixed;
        top: 20%;
        width: 60em;
        // background-color: #fff;

        .language {
          padding: 0.2em 0.5em;
          border: 1px solid black;
          cursor: pointer;
          z-index: 2;
          background-color: #fff;
          display: inline-block;

          &:hover {
            background-color: #ccc;
          }

          &:active {
            background-color: #aaa;
          }
        }
      }

      .overlay {
        background-color: #0008;
        z-index: -1;
        position: fixed;
        width: 100%;
        height: 100%;
        inset: 0;
        backdrop-filter: blur(12px);
      }
    }
  }

  .i18n-ui {
    --bg-color: #ddd;
    display: flex;

    .i18n-pick {
      position: relative;
      height: 100%;
      padding: 8px;
      background-color: var(--bg-color);
      border-right: 2px solid #ccc;
    }

    button {
      background-color: var(--bg-color);
      outline: none;
      border: none;
    }

    * {
      cursor: pointer;
    }

    *:hover {
      filter: brightness(90%);
    }
  }
</style>
