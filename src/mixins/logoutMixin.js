export var logoutMixin = {
  methods: {
    logout: function() {
      this.$store.commit("SET_MID_LOGIN", false);
      this.$store.commit("SET_PROFILE", {
        "email": "",
        "writable_topics": ["hermes.test"]
      });

      location.reload();
    }
  }
};
