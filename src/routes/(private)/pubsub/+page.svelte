<script lang="ts">
    import { apiRequest } from "$lib/api/utils";
    import type { ApiResponse } from "$lib/models/apiResponse";
    import type { Notification } from "$lib/models/notification";
    import type { Topic } from "$lib/models/topic";
    import {
        DataTable,
        DataTableSkeleton,
        Toolbar,
        ToolbarContent,
        ToolbarSearch,
    } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { JsonView } from "@zerodevx/svelte-json-view";

    let initialized = false;
    let topics: Topic[] = [];
    let notification: Notification = {};
    let timeout: any = undefined;
    let isLoading: boolean = true;
    let filteredRowIds: string[] = [];
    let isSearching: boolean = false;

    onMount(() => {
        getTopics();
    });

    async function getTopics() {
        if (isSearching) return;

        if (!initialized) isLoading = true;

        const response = await apiRequest<ApiResponse<Topic[]>>(
            "pubsub",
            "GET",
        );

        if (response.status === 200) {
            const newOnes = response.data || [];

            if (!isSearching) {
                for (const newTopic of newOnes) {
                    const index = topics.findIndex((t) => t.id === newTopic.id);
                    if (index === -1) {
                        topics.push(newTopic);
                    } else {
                        topics[index] = newTopic;
                    }
                }
            }
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
        initialized = true;

        timeout = setTimeout(() => {
            getTopics();
        }, 1000);
    }

    $: console.log(isSearching);

    $: console.log(filteredRowIds);
</script>

{#if isLoading}
    <DataTableSkeleton
        showToolbar={false}
        headers={[
            "ID",
            "Created At",
            "Publisher ID",
            "Subscriber ID",
            "Has Content",
        ]}
        rows={15}
    />
{:else if topics.length === 0 && !isLoading}
    <div class="flex flex-col items-center justify-center w-full !mt-20">
        <h1 class="!font-thin">No topics available</h1>
        <p class="!font-thin">You don't have any topics yet.</p>
    </div>
{:else}
    <DataTable
        title="Pub/Sub"
        description="Topics with messages"
        expandable
        headers={[
            { key: "id", value: "ID" },
            { key: "createdAt", value: "Created At" },
            { key: "publisherId", value: "Publisher ID" },
            { key: "subscriberId", value: "Subscriber ID" },
            { key: "hasContent", value: "Has Content" },
        ]}
        rows={topics.map((topic) => ({
            id: topic.id,
            createdAt: topic.createdAt,
            publisherId: topic.publisherId,
            subscriberId: topic.subscriberId,
            hasContent: topic.content?.messages ? "Yes" : "No",
        }))}
    >
        <Toolbar>
            <ToolbarContent>
                <ToolbarSearch
                    persistent
                    placeholder="Search topics..."
                    on:input={(e) =>
                        (isSearching = !!(e.target as HTMLInputElement).value)}
                    on:clear={() => (isSearching = false)}
                    shouldFilterRows={(row, value) => {
                        const val = value.toString().toLowerCase();

                        const matchInContent = (() => {
                            const topic = topics.find((t) => t.id === row.id);
                            if (!topic || !topic.content) return false;
                            const jsonString = JSON.stringify(
                                topic.content,
                            ).toLowerCase();
                            return jsonString.includes(val);
                        })();

                        return (
                            row.id.toLowerCase().includes(val) ||
                            row.publisherId.toLowerCase().includes(val) ||
                            row.subscriberId.toLowerCase().includes(val) ||
                            row.hasContent.toLowerCase().includes(val) ||
                            matchInContent
                        );
                    }}
                    bind:filteredRowIds
                />
            </ToolbarContent>
        </Toolbar>

        <svelte:fragment slot="expanded-row" let:row>
            <div
                style="
        --jsonPaddingLeft: 1rem;
        --jsonBorderLeft: 1px dotted #444;
        --jsonBracketColor: #ccc;
        --jsonBracketHoverBackground: #2d2d2d;
        --jsonSeparatorColor: #666;
        --jsonKeyColor: #4fc3f7;
        --jsonValColor: #9ca3af;
        --jsonValStringColor: #a5d6a7;
        --jsonValNumberColor: #f78c6c;
        --jsonValBooleanColor: #82aaff;
        font-family: monospace;
      "
            >
                <JsonView json={topics.find((t) => t.id === row.id)?.content} />
            </div>
        </svelte:fragment>
    </DataTable>
{/if}
