<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand to="/"><img :src="require('@/assets/images/hermes_logo_white.png')" height="32px" width="32px"></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/">HERMES</b-nav-item>
          <b-nav-item to="/report-events">Submit New Non-localized Event</b-nav-item>
          <b-nav-item to="/report-candidates">Submit Candidates</b-nav-item>
          <b-nav-item to="/report-non-detections">Submit Non-Detections</b-nav-item>
          <b-nav-item to="/report-search">Submit Search Pointings</b-nav-item>
          <b-nav-item to="/report-photometry">Report Photometry</b-nav-item>
          <b-nav-item to="/report-spectroscopy">Report Spectroscopy</b-nav-item>
          <b-nav-item to="/report-availability">Report Observatory Availability</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
           <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>User</em>
          </template>
          <b-dropdown-item href="#">Login</b-dropdown-item>
        </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  methods: {
  },
  data() {
    return {
    };
  }
};
</script>

<style lang="scss" scoped>
#nav {a.router-link-exact-active {
  color: white;
};
width: 100%;
}

</style>