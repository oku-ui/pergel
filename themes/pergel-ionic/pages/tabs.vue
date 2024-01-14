<script setup lang="ts">
</script>

<template>
  <IonPage>
    <IonContent>
      <IonTabs>
        <IonRouterOutlet />

        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tabs/tab1">
            <div class="i-ph-house-bold"></div>
            <IonLabel>Tab 1</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonContent>
  </IonPage>
</template>
