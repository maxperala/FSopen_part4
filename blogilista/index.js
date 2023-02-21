app = require("./app");
const { url, PORT } = require("./utils/config");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
