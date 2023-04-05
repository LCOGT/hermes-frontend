export var logoutMixin = {
  methods: {
    logout: function() {
      this.$store.commit("SET_USER_NAME", "HERMES Guest");
      this.$store.commit("SET_MID_LOGIN", false);
      this.$store.commit("SET_WRITABLE_TOPICS", ["hermes.test"]);
      location.reload();
    }
  }
};
