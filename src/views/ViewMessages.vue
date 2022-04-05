<template>
  <div>
    <b-table striped hover :items="items"></b-table>
  </div>
</template>

<script>
export default {
  name: "ViewMessages",
  data() {
    return {
      items: [
        {title: 'Title1', authors: 'Authors1', message: 'Message1'},
        {title: 'Title2', authors: 'Authors2', message: 'Message2'},
        {title: 'Title3', authors: 'Authors3', message: 'Message3'},
      ]
    }
  }
}
</script>
