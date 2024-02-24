<script setup lang="ts">
import { listenNowAlbums, madeForYouAlbums } from '~/components/home/data/albums'
import { playlists } from '~/components/home/data/playlists'

definePageMeta({
  middleware: ['protected'],
})

// const user = useUser()
// const { fetching } = useQuery({
//   query: changeNameGraphQLClient.UsersDocument,
// })
const menu = ref(false)
</script>

<template>
  <div
    v-show="menu"
    class="fixed inset-0 z-50 size-full bg-black lg:hidden"
  >
    <HomeSidebar :playlists="playlists" />
  </div>
  <div>
    <HomeMenu />
    <div class="border-t">
      <div class="bg-background">
        <div class="grid lg:grid-cols-5">
          <HomeSidebar :playlists="playlists" class="hidden lg:block" />
          <div class="col-span-3 overflow-hidden lg:col-span-4 lg:border-l">
            <div class="h-full px-4 py-6 lg:px-8">
              <Tabs default-value="music" class="h-full space-y-6">
                <div class="space-between flex items-center">
                  <TabsList>
                    <TabsTrigger value="music" class="relative">
                      Music
                    </TabsTrigger>
                    <TabsTrigger value="podcasts">
                      Podcasts
                    </TabsTrigger>
                    <TabsTrigger value="live" disabled>
                      Live
                    </TabsTrigger>
                  </TabsList>
                  <div class="ml-auto mr-4">
                    <Button>
                      <AtomIcon
                        dynamic
                        name="i-ph-plus-bold"
                        class="mr-2 size-4"
                      />
                      Add music
                    </Button>
                  </div>
                </div>
                <TabsContent value="music" class="border-none p-0 outline-none">
                  <div class="flex items-center justify-between">
                    <div class="space-y-1">
                      <h2 class="text-2xl font-semibold tracking-tight">
                        Listen Now
                      </h2>
                      <p class="text-muted-foreground text-sm">
                        Top picks for you. Updated daily.
                      </p>
                    </div>
                  </div>
                  <Separator class="my-4" />
                  <div class="relative">
                    <ScrollArea>
                      <div class="flex space-x-4 pb-4">
                        <HomeAlbumArtwork
                          v-for="album in listenNowAlbums" :key="album.name" :album="album" class="w-[250px]"
                          aspect-ratio="portrait" :width="250" :height="330"
                        />
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                  <div class="mt-6 space-y-1">
                    <h2 class="text-2xl font-semibold tracking-tight">
                      Made for You
                    </h2>
                    <p class="text-muted-foreground text-sm">
                      Your personal playlists. Updated daily.
                    </p>
                  </div>
                  <Separator class="my-4" />
                  <div class="relative">
                    <ScrollArea>
                      <div class="flex space-x-4 pb-4">
                        <HomeAlbumArtwork
                          v-for="album in madeForYouAlbums" :key="album.name" :album="album" class="w-[150px]"
                          aspect-ratio="square" :width="150" :height="150"
                        />
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </TabsContent>
                <TabsContent value="podcasts" class="h-full flex-col border-none p-0 data-[state=active]:flex">
                  <div class="flex items-center justify-between">
                    <div class="space-y-1">
                      <h2 class="text-2xl font-semibold tracking-tight">
                        New Episodes
                      </h2>
                      <p class="text-muted-foreground text-sm">
                        Your favorite podcasts. Updated daily.
                      </p>
                    </div>
                  </div>
                  <Separator class="my-4" />
                  <HomePodcastEmptyPlaceholder />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
