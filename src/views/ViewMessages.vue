<template>
  <div>
    <b-row>
      <b-col>
      <b-table small hover noCollapse outlined sticky-header sort-icon-left
        head-variant="light" 
        select-mode="single"
        selectable
        reactive
        @row-clicked="onRowClicked"
        :items="items" :fields="fields">

        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>

        <template #head()="data">
          <span variant="secondary">{{ data.label.toUpperCase() }}</span>
        </template>

        <template #cell(selected)="{ rowSelected }">
          <template v-if="rowSelected">
            <span aria-hidden="true">&#10624;</span>
          </template>
          <template v-else>
            <span aria-hidden="true">&Rrightarrow;</span>
          </template>
        </template>

      </b-table>
      </b-col>
      <b-col>
      <b-card class="h-100"
        style="width: 20rem;"
      >
        <pre v-if="selectedItem">
          <b-card-title>Message</b-card-title>
          {{ selectedItem.message }}</pre>
        <h4 class="text-center" v-else>
          Expand a message.
        </h4>
      </b-card>
    </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "ViewMessages",
  data() {
    return {
      fields: [
          'index',
          {
            key: 'title',
            sortable: true
          },
          {
            key: 'authors',
            sortable: true
          },
          {
            key: 'selected',
            label: '',
            headerTitle: 'selected'
          },
        ],
      items: [
        {title: 'Title1', authors: 'Authors1', message: 'Message1'},
        {title: 'Title2', authors: 'Authors2', message: 'A longer message'},
        {title: 'Title3', authors: 'Authors3', message: 'no'},
      ],
      selectedItem: null
    }
  },
  methods: {
    onRowClicked(item) {
      this.selectedItem = item
    }
  }
}
</script>
