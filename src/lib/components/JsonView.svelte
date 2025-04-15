<script lang="ts">
    import { Copy } from "carbon-icons-svelte";

    export let json: any;

    const highlighted = syntaxHighlight(JSON.stringify(json, null, 2));
    const rawJson = JSON.stringify(json, null, 2);

    function syntaxHighlight(json: string) {
        json = json
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        return json.replace(
            /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,
            (match, stringLiteral, _2, keyColon, literal) => {
                if (keyColon) {
                    return `<span class="key">${match}</span>`;
                }
                if (stringLiteral) {
                    return `<span class="string">${match}</span>`;
                }
                if (/true|false/.test(match)) {
                    return `<span class="boolean">${match}</span>`;
                }
                if (/null/.test(match)) {
                    return `<span class="null">${match}</span>`;
                }
                return `<span class="number">${match}</span>`;
            },
        );
    }

    async function copyToClipboard() {
        await navigator.clipboard.writeText(rawJson);
    }
</script>

<div class="json-wrapper">
    <button
        class="copy-icon"
        on:click={copyToClipboard}
        title="Copy JSON"
        type="button"
    >
        <Copy />
    </button>
    <pre>{@html highlighted}</pre>
</div>

<style>
    .json-wrapper {
        position: relative;
        margin-left: -3rem;
        margin-bottom: 1rem;
    }

    .copy-icon {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        cursor: pointer;
        background: #2a2a2a;
        padding: 6px;
        transition: background 0.2s;
    }

    .copy-icon:hover {
        background: #444;
    }

    pre {
        background: #1e1e1e;
        padding: 1rem;
        border-radius: 6px;
        overflow-x: auto;
        font-family: monospace;
        font-size: 14px;
        margin: 0;
        color: #ccc;
    }

    :global(.key) {
        color: #4fc3f7;
    }

    :global(.string) {
        color: #03a009;
    }

    :global(.number) {
        color: #f78c6c;
    }

    :global(.boolean) {
        color: #82aaff;
    }

    :global(.null) {
        color: gray;
    }
</style>
