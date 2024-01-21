<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <IonPage>
    <IonContent>
      <IonTabs>
        <IonRouterOutlet />

        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tabs/home">
            <div class="i-ph-house-bold"></div>
            <IonLabel>{{ t("tabs.home") }}</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tabs/settings">
            <div class="i-ph-gear"></div>
            <IonLabel>{{ t("tabs.settings") }}</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
      <IonFab slot="fixed" vertical="bottom" horizontal="center">
        <IonFabButton href="/tabs/profile">
          <div class="i-ph-user"></div>
        </IonFabButton>
      </IonFab>
    </IonContent>
  </IonPage>
</template>
