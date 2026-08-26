import { defineStore } from 'pinia'

/*
  Holds the set of Hermes messages a user has selected to package into
  a single Zenodo DOI. A "cart" with exactly one item is the same code
  path as minting a DOI for a single message - there is no special case.

  Zenodo Sandbox / Production limits (as of this writing):
    - Max file size per file: 50 GB (effectively unlimited for our use case)
    - Max files per deposition: no hard cap, but we impose a practical UI limit
      so the demo stays manageable and reviewable by a human before minting.
  These are intentionally conservative and can be loosened later.
*/

const MAX_PACKAGE_ITEMS = 25
const MAX_TOTAL_SIZE_BYTES = 100 * 1024 * 1024 // 100 MB practical demo ceiling

export const useDoiCartStore = defineStore('doiCart', {
  state: () => ({
    // Keyed by message UUID to make add/remove/has-check O(1) and to
    // trivially avoid duplicate entries.
    items: {}, // { [uuid]: { uuid, title, topic, sender, timestamp, sizeBytes, fileName } }
  }),
  persist: true,
  getters: {
    itemList: (state) => Object.values(state.items),
    count: (state) => Object.keys(state.items).length,
    isEmpty: (state) => Object.keys(state.items).length === 0,
    totalSizeBytes: (state) => {
      return Object.values(state.items).reduce((sum, item) => sum + (item.sizeBytes || 0), 0)
    },
    hasItem: (state) => (uuid) => Boolean(state.items[uuid]),
    exceedsItemLimit: (state) => Object.keys(state.items).length > MAX_PACKAGE_ITEMS,
    exceedsSizeLimit(state) {
      return this.totalSizeBytes > MAX_TOTAL_SIZE_BYTES
    },
    isValidForMinting() {
      return !this.isEmpty && !this.exceedsItemLimit && !this.exceedsSizeLimit
    },
    limits: () => ({
      maxItems: MAX_PACKAGE_ITEMS,
      maxTotalSizeBytes: MAX_TOTAL_SIZE_BYTES,
    }),
  },
  actions: {
    add(item) {
      // item: { uuid, title, topic, sender, timestamp, sizeBytes, fileName }
      this.items[item.uuid] = item
    },
    remove(uuid) {
      delete this.items[uuid]
    },
    toggle(item) {
      if (this.items[item.uuid]) {
        this.remove(item.uuid)
      } else {
        this.add(item)
      }
    },
    clear() {
      this.items = {}
    },
  },
})