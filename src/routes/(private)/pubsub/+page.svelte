<script lang="ts">
    import { apiRequest } from "$lib/api/utils";
    import JsonView from "$lib/components/JsonView.svelte";
    import type { ApiResponse } from "$lib/models/apiResponse";
    import type { Notification } from "$lib/models/notification";
    import type { Topic } from "$lib/models/topic";
    import {
        Button,
        DataTable,
        DataTableSkeleton,
        OverflowMenu,
        OverflowMenuItem,
        Tile,
        ToastNotification,
        Toolbar,
        ToolbarBatchActions,
        ToolbarContent,
        ToolbarSearch,
    } from "carbon-components-svelte";
    import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let initialized = false;
    let topics: Topic[] = [];
    let notification: Notification = {};
    let timeout: any = undefined;
    let isLoading: boolean = true;
    let filteredRowIds: string[] = [];
    let isSearching: boolean = false;
    let selectedRowIds: string[] = [];
    let rowIdToDelete: string[] = [];
    let active: boolean = false;

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

    async function deleteTopics() {
        if (selectedRowIds.length === 0 && rowIdToDelete.length === 0) {
            return;
        }

        const response = await apiRequest<ApiResponse<null>>(
            "pubsub",
            "DELETE",
            { ids: selectedRowIds.length > 0 ? selectedRowIds : rowIdToDelete },
        );

        if (response.status === 200) {
            topics = topics.filter((topic) => {
                return !rowIdToDelete.includes(topic.id);
            });
            topics = topics.filter((topic) => {
                return !selectedRowIds.includes(topic.id);
            });

            rowIdToDelete = [];
            selectedRowIds = [];
            active = false;

            notification = {
                kind: "success",
                title: "Success",
                subtitle: "Topics deleted successfully.",
                caption: new Date().toLocaleString(),
                timeout: 3_000,
            };
        } else {
            notification = {
                kind: "error",
                title: "Error",
                subtitle: response.message,
                caption: new Date().toLocaleString(),
                timeout: 3_000,
            };
            rowIdToDelete = [];
            selectedRowIds = [];
        }
    }
</script>

{#if isLoading}
    <DataTableSkeleton
        headers={[
            "ID",
            "Created At",
            "Publisher ID",
            "Subscriber ID",
            "Has Content",
            "",
        ]}
        rows={15}
    />
{:else if topics.length === 0 && !isLoading}
    <div class="flex flex-col items-center justify-center w-full !mt-20">
        <h1 class="!font-thin">No topics available</h1>
        <p class="!font-thin">No topics have been created yet.</p>
    </div>
{:else}
    <Tile>
        <DataTable
            batchSelection
            selectable
            bind:selectedRowIds
            sortable
            title="Pub/Sub"
            description="Topics with content"
            batchExpansion
            expandable
            headers={[
                { key: "id", value: "ID" },
                {
                    key: "createdAt",
                    value: "Created At",
                    display: (date) => new Date(date).toLocaleString(),
                    sort: (a, b) =>
                        new Date(a).getTime() - new Date(b).getTime(),
                },
                { key: "publisherId", value: "Publisher ID" },
                { key: "subscriberId", value: "Subscriber ID" },
                { key: "hasContent", value: "Has Content" },
                { key: "overflow", empty: true },
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
                    <ToolbarBatchActions
                        bind:active
                        on:cancel={(e) => {
                            e.preventDefault();
                            active = false;
                        }}
                    >
                        <Button
                            kind="danger"
                            icon={TrashCan}
                            disabled={selectedRowIds.length === 0}
                            on:click={() => {
                                deleteTopics();
                            }}
                        >
                            Delete
                        </Button>
                    </ToolbarBatchActions>
                    {#if !active}
                        <ToolbarSearch
                            persistent
                            placeholder="Search topics..."
                            on:input={(e) =>
                                (isSearching = !!(e.target as HTMLInputElement)
                                    .value)}
                            on:clear={() => (isSearching = false)}
                            shouldFilterRows={(row, value) => {
                                const val = value.toString().toLowerCase();

                                const matchInContent = (() => {
                                    const topic = topics.find(
                                        (t) => t.id === row.id,
                                    );
                                    if (!topic || !topic.content) return false;
                                    const jsonString = JSON.stringify(
                                        topic.content,
                                    ).toLowerCase();
                                    return jsonString.includes(val);
                                })();

                                return (
                                    row.id.toLowerCase().includes(val) ||
                                    row.publisherId
                                        .toLowerCase()
                                        .includes(val) ||
                                    row.subscriberId
                                        .toLowerCase()
                                        .includes(val) ||
                                    row.hasContent
                                        .toLowerCase()
                                        .includes(val) ||
                                    matchInContent
                                );
                            }}
                            bind:filteredRowIds
                        />
                    {/if}
                </ToolbarContent>
            </Toolbar>
            <svelte:fragment slot="cell" let:cell let:row>
                {#if cell.key === "overflow"}
                    <OverflowMenu flipped>
                        <OverflowMenuItem
                            danger
                            text="Delete"
                            on:click={() => {
                                rowIdToDelete = [row.id];
                                deleteTopics();
                            }}
                        />
                    </OverflowMenu>
                {:else}{cell.value}{/if}
            </svelte:fragment>
            <svelte:fragment slot="expanded-row" let:row>
                <JsonView json={topics.find((t) => t.id === row.id)?.content} />
            </svelte:fragment>
        </DataTable>
    </Tile>
{/if}

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
