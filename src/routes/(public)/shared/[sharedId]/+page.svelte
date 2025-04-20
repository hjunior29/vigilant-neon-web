<script lang="ts">
    import { page } from "$app/state";
    import { apiRequest } from "$lib/api/utils";
    import JsonView from "$lib/components/JsonView.svelte";
    import type { ApiResponse } from "$lib/models/apiResponse";
    import type { Notification } from "$lib/models/notification";
    import type { Topic } from "$lib/models/topic";
    import {
        Content,
        Loading,
        Modal,
        ToastNotification,
    } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let notification: Notification = {};
    let timeout: any = undefined;
    let isLoading = false;
    let topic: Topic = {};

    const sharedId = page.params.sharedId;

    onMount(() => {
        getTopics();
    });

    async function getTopics() {
        const response = await apiRequest<ApiResponse<Topic>>(
            `pubsub/shared/${sharedId}`,
            "GET",
        );

        if (response.status === 200) {
            topic = response.data || {};
        } else {
            notification = {
                kind: "error",
                title: "Error",
                subtitle: response.message,
                caption: new Date().toLocaleString(),
                timeout: 3_000,
            };
        }

        isLoading = false;

        timeout = setTimeout(() => {
            getTopics();
        }, 1000);
    }
</script>

<Content>
    {topic.id}
    <div class="json-wrapper">
        {#if topic.content}
            {#key topic.content}
                <JsonView json={topic.content} />
            {/key}
        {:else}
            <Loading />
        {/if}
    </div>
</Content>

{#if notification.kind}
    <div
        class="fixed bottom-4 right-4 w-96 transition-opacity duration-300"
        transition:fade
    >
        <ToastNotification
            timeout={notification.timeout}
            kind={notification.kind}
            title={notification.title}
            subtitle={notification.subtitle}
            caption={notification.caption}
            on:close={(e) => {
                timeout = undefined;
                notification = {};
            }}
        />
    </div>
{/if}

<style>
    .json-wrapper {
        position: relative;
        margin-left: 3rem;
    }
</style>
