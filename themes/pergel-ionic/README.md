
## Setup

Make sure to install the dependencies:

```bash
#install project dependencies
pnpm install

#install pergel dependencies
pergel install

pnpm generate

#nuxt build
pnpm build

#enabling capacitor
ionic config set -g npmClient pnpm
ionic integrations enable capacitor

# add android or ios platform
pnpm cap-add-android || pnpm cap-add-ios 

#
pnpm cap-copy 

pnpm cap-sync-android || pnpm cap-sync-ios 

# open with android studio
pnpm cap-open-android

# launch with device or emulator in android studio

** Remember to run npx cap sync after every new build to ensure your Android and/or iOS project is up-to-date.
```
