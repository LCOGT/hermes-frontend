<script setup>
import { ref, computed, watch } from 'vue';
import { useDoiCartStore } from '@/stores/doiCart';
import { useStateStore } from '@/stores/state';
import { useLogout } from '@/utils/logout.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  singleItem: { type: Object, default: null },
});

const emit = defineEmits(['update:modelValue']);

const cart = useDoiCartStore();
const stateStore = useStateStore();
const { logout } = useLogout();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const packageItems = computed(() => {
  return props.singleItem ? [props.singleItem] : cart.itemList;
});

const canRemoveItems = computed(() => !props.singleItem);

function removeItem(uuid) {
  cart.remove(uuid);
}

watch(packageItems, (items) => {
  if (isOpen.value && status.value === 'idle' && items.length === 0) {
    isOpen.value = false;
  }
});

const title = ref('');
const description = ref('');
const authorName = ref('');
const authorAffiliation = ref('');
const keywords = ref('');

const status = ref('idle'); // idle | minting | success | error
const errorMessage = ref('');
const resultDoi = ref(null);
const resultUrl = ref(null);
const mintedItemCount = ref(0);

const confirmationPending = ref(false);

// Duplicate-detection check state.
const checkStatus = ref('idle'); // idle | checking | ok | warning | blocked
const checkConflicts = ref([]); // used when checkStatus === 'warning'
const checkBlockedInfo = ref(null); // { doi, record_url, title } when checkStatus === 'blocked'

async function runDoiCheck() {
  checkStatus.value = 'checking';
  try {
    const params = new URLSearchParams();
    packageItems.value.forEach((item) => params.append('message_uuids', item.uuid));
    const url = new URL(`api/v0/doi/check/?${params.toString()}`, stateStore.hermesUrl).href;
    const response = await fetch(url, { credentials: 'include' });

    if (!response.ok) {
      // The duplicate check is a courtesy, not a hard requirement - if it
      // fails (network issue, backend hiccup), don't block the user from
      // minting; just proceed as if nothing was found.
      console.error('DOI duplicate check failed:', response.status);
      checkStatus.value = 'ok';
      return;
    }

    const data = await response.json();
    if (data.status === 'blocked') {
      checkStatus.value = 'blocked';
      checkBlockedInfo.value = { doi: data.doi, record_url: data.record_url, title: data.title };
    } else if (data.status === 'warning') {
      checkStatus.value = 'warning';
      checkConflicts.value = data.conflicts || [];
    } else {
      checkStatus.value = 'ok';
    }
  } catch (error) {
    console.error('DOI duplicate check failed:', error);
    checkStatus.value = 'ok';
  }
}

watch(isOpen, (open) => {
  if (open) {
    status.value = 'idle';
    errorMessage.value = '';
    resultDoi.value = null;
    resultUrl.value = null;
    confirmationPending.value = false;
    checkStatus.value = 'idle';
    checkConflicts.value = [];
    checkBlockedInfo.value = null;

    const items = packageItems.value;
    if (items.length === 1) {
      title.value = items[0].title || `Hermes message ${items[0].uuid}`;
    } else {
      title.value = `Hermes message package (${items.length} messages)`;
    }
    description.value = buildDefaultDescription(items);
    authorName.value = stateStore.profile?.email ? stateStore.profile.email : '';
    authorAffiliation.value = '';
    keywords.value = 'hermes, multi-messenger astronomy';

    runDoiCheck();
  }
});

function buildDefaultDescription(items) {
  const lines = items.map((item) => `- [${item.topic}] ${item.title || item.uuid}`);
  return `This record packages the following Hermes message(s):\n\n${lines.join('\n')}`;
}

async function requestConfirmation() {
  // Re-run the check right before confirming, in case something changed
  // since the dialog was opened (e.g. someone else minted an identical
  // package in the meantime). This is the authoritative, final gate.
  await runDoiCheck();
  if (checkStatus.value === 'blocked') {
    return;
  }
  confirmationPending.value = true;
}

function cancelConfirmation() {
  confirmationPending.value = false;
}

async function confirmMint() {
  confirmationPending.value = false;
  status.value = 'minting';
  errorMessage.value = '';
  mintedItemCount.value = packageItems.value.length;
  try {
    const metadata = {
      title: title.value,
      description: description.value,
      creators: [
        {
          name: authorName.value || 'Hermes User',
          ...(authorAffiliation.value ? { affiliation: authorAffiliation.value } : {}),
        },
      ],
      keywords: keywords.value
        ? keywords.value.split(',').map((k) => k.trim()).filter(Boolean)
        : undefined,
    };

    const url = new URL('api/v0/doi/mint/', stateStore.hermesUrl).href;
    const response = await fetch(url, {
      mode: 'cors',
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': stateStore.csrf_token,
      },
      body: JSON.stringify({
        message_uuids: packageItems.value.map((item) => item.uuid),
        metadata,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const error = new Error(body.error || `Minting failed (HTTP ${response.status})`);
      error.status = response.status;
      throw error;
    }

    const published = await response.json();
    resultDoi.value = published.doi;
    resultUrl.value = published.record_url;
    status.value = 'success';

    if (!props.singleItem) {
      cart.clear();
    }
  } catch (error) {
    console.error('DOI minting failed:', error);
    errorMessage.value = error.message || 'Unknown error while minting DOI.';
    status.value = 'error';
    if (error.status === 401) {
      logout();
    }
  }
}

function close() {
  isOpen.value = false;
}
</script>

<template>
  <v-dialog v-model="isOpen" max-width="700" persistent>
    <v-card>
      <v-card-title>
        {{ status === 'success'
          ? (mintedItemCount === 1 ? 'Mint DOI for Message' : `Mint DOI for Package (${mintedItemCount} messages)`)
          : (packageItems.length === 1 ? 'Mint DOI for Message' : `Mint DOI for Package (${packageItems.length} messages)`) }}
      </v-card-title>

      <v-card-text v-if="status === 'success'">
        <v-alert type="success" variant="tonal" class="mb-3">
          DOI minted successfully.
        </v-alert>
        <p><b>DOI:</b> {{ resultDoi }}</p>
        <p>
          <b>Record:</b>
          <a :href="resultUrl" target="_blank" rel="noopener">{{ resultUrl }}</a>
        </p>
      </v-card-text>

      <v-card-text v-else-if="checkStatus === 'blocked'">
        <v-alert type="error" variant="tonal" class="mb-3">
          This exact message (or set of messages) has already been used to mint a DOI. Minting an
          identical duplicate is not allowed.
        </v-alert>
        <p><b>Existing DOI:</b> {{ checkBlockedInfo?.doi }}</p>
        <p v-if="checkBlockedInfo?.title"><b>Title:</b> {{ checkBlockedInfo.title }}</p>
        <p>
          <b>Record:</b>
          <a :href="checkBlockedInfo?.record_url" target="_blank" rel="noopener">{{ checkBlockedInfo?.record_url }}</a>
        </p>
      </v-card-text>

      <v-card-text v-else>
        <v-alert v-if="status === 'error'" type="error" variant="tonal" class="mb-3">
          {{ errorMessage }}
        </v-alert>

        <v-alert v-if="checkStatus === 'warning'" type="warning" variant="tonal" class="mb-3">
          <div>Some of these message(s) have already been used in another DOI:</div>
          <ul class="mt-1">
            <li v-for="conflict in checkConflicts" :key="conflict.doi">
              {{ conflict.matched_uuids.length }} message(s) already in
              <a :href="conflict.record_url" target="_blank" rel="noopener">{{ conflict.doi }}</a>
              <span v-if="conflict.title"> ({{ conflict.title }})</span>
            </li>
          </ul>
        </v-alert>

        <v-list density="compact" class="mb-3">
          <v-list-subheader>Messages in this package</v-list-subheader>
          <v-list-item v-for="item in packageItems" :key="item.uuid" :title="item.title || item.uuid"
            :subtitle="item.topic">
            <template v-if="canRemoveItems" v-slot:append>
              <v-btn icon="mdi-close" variant="text" size="small" :disabled="status === 'minting'"
                v-tooltip="'Remove from package'" @click="removeItem(item.uuid)"></v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-text-field v-model="title" label="Title" variant="outlined" density="compact" class="mb-2"
          :disabled="status === 'minting' || confirmationPending"></v-text-field>
        <v-textarea v-model="description" label="Description" variant="outlined" density="compact" rows="4"
          class="mb-2" :disabled="status === 'minting' || confirmationPending"></v-textarea>
        <v-text-field v-model="authorName" label="Author Name" variant="outlined" density="compact" class="mb-2"
          :disabled="status === 'minting' || confirmationPending"></v-text-field>
        <v-text-field v-model="authorAffiliation" label="Author Affiliation (optional)" variant="outlined"
          density="compact" class="mb-2" :disabled="status === 'minting' || confirmationPending"></v-text-field>
        <v-text-field v-model="keywords" label="Keywords (comma separated)" variant="outlined" density="compact"
          :disabled="status === 'minting' || confirmationPending"></v-text-field>

        <v-alert v-if="confirmationPending" type="warning" variant="tonal" class="mt-3">
          Minting a DOI for {{ packageItems.length }} message{{ packageItems.length === 1 ? '' : 's' }} is
          permanent and cannot be undone. Proceed?
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <template v-if="status === 'success' || checkStatus === 'blocked'">
          <v-btn variant="text" @click="close">Close</v-btn>
        </template>

        <template v-else-if="confirmationPending">
          <v-btn variant="text" @click="cancelConfirmation">Go Back</v-btn>
          <v-btn color="warning" variant="flat" @click="confirmMint">Yes, Mint DOI</v-btn>
        </template>

        <template v-else>
          <v-btn variant="text" @click="close" :disabled="status === 'minting'">Cancel</v-btn>
          <v-btn color="primary" variant="flat" :loading="status === 'minting' || checkStatus === 'checking'"
            :disabled="!title || !authorName" @click="requestConfirmation">
            Confirm Mint
          </v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>