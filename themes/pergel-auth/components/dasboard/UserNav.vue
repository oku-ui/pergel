<script setup lang="ts">
const user = useUser()
const router = useRouter()
const { executeMutation } = useMutation(changeNameGraphQLClient.LogoutDocument)

async function logout() {
  try {
    await executeMutation({})
    push.success('Logged out')
  }
  catch (error) {
    console.error('Failed to logout', error)
  }
  router.push('/auth/login')
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="relative size-8 rounded-full">
        <Avatar class="size-8">
          <AvatarImage
            :src="user?.picture || '/avatars/placeholder.jpg'"
          />
          <AvatarFallback>OKU</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="flex font-normal">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">
            shadcn
          </p>
          <p class="text-muted-foreground text-xs leading-none">
            m@example.com
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Billing
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Settings
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>New Team</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        @click="logout"
      >
        Log out
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
