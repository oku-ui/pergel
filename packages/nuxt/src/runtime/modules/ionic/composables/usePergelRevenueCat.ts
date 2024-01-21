import { LOG_LEVEL, PRODUCT_CATEGORY, Purchases } from '@revenuecat/purchases-capacitor'
import type { PergelGlobalContextOmitModule } from '#pergel/types'

export interface Credentials {
  apiKey: string
  appUserID: string
}

export async function usePergelRevenueCat(
  this: PergelGlobalContextOmitModule,
  credentials: Credentials,
) {
  const prettifyJson = (objectToPrettify: object) => {
    return JSON.stringify(objectToPrettify, null, 2)
  }

  // Initialize RevenueCat
  async function initializeRevenueCat() {
    console.log('initializeRevenueCat')
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG }) // Enable to get debug logs
    await Purchases.configure({
      apiKey: credentials.apiKey,
      appUserID: credentials.appUserID, // Optional
    })
    await Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      console.log(`Received customer info in listener: ${prettifyJson(customerInfo)}`)
    })
  }

  const getOfferings = async () => {
    const offerings = await Purchases.getOfferings()
    return offerings
  }

  const getProducts = async () => {
    const productIds = ['annual_freetrial', 'unknown_product']
    const products = await Purchases.getProducts({
      productIdentifiers: productIds,
      type: PRODUCT_CATEGORY.SUBSCRIPTION,
    })
    return products
  }

  const purchasePackage = async () => {
    console.log('purchasePackage')
    const offerings = await Purchases.getOfferings()
    const packageToBuy = offerings.current
      && offerings.current.availablePackages
      && offerings.current.availablePackages[0]
    if (packageToBuy == null)
      return 'No package found in current offering'

    const purchaseResult = await Purchases.purchasePackage({
      aPackage: packageToBuy,
    })
    return purchaseResult
  }

  const restorePurchases = async () => {
    const customerInfo = await Purchases.restorePurchases()
    return customerInfo
  }

  const getAppUserID = async () => {
    const appUserID = await Purchases.getAppUserID()
    return appUserID
  }

  const logIn = async () => {
    const appUserIDToUse = 'test-capacitor-app-user-id'
    const customerInfo = await Purchases.logIn({ appUserID: appUserIDToUse })
    return customerInfo
  }

  const logOut = async () => {
    const customerInfo = await Purchases.logOut()
    return customerInfo
  }

  const getCustomerInfo = async () => {
    const customerInfo = await Purchases.getCustomerInfo()
    return customerInfo
  }

  const syncPurchases = async () => {
    await Purchases.syncPurchases()
  }

  const isConfigured = async () => {
    const isConfiguredResult = await Purchases.isConfigured()
    return isConfiguredResult
  }

  return {
    initializeRevenueCat,
    getOfferings,
    getProducts,
    purchasePackage,
    restorePurchases,
    getAppUserID,
    logIn,
    logOut,
    getCustomerInfo,
    syncPurchases,
    isConfigured,
  }
}
