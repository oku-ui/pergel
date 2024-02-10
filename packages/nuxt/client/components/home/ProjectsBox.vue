<script setup lang="ts">
interface Props {
  projects: string[]
}

withDefaults(defineProps<Props>(), {
  projects: () => ['test1', 'test2'],
})
const value = defineModel<any>()
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <Card>
      <CardHeader>
        <CardTitle
          class="mb-4 items-center justify-center text-center"
        >
          Open Project
        </CardTitle>
        <div>
          <Select
            v-model="value"
          >
            <SelectTrigger>
              <SelectValue
                placeholder="Select a project"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>
                  Projects
                </SelectLabel>
                <SelectItem
                  v-for="project in projects"
                  :key="project"
                  :value="project"
                >
                  {{ project }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Separator />
        <div class="mt-4">
          <slot />
        </div>
      </CardContent>
      <CardFooter>
        asdasdasd
      </CardFooter>
    </Card>
  </div>
</template>
