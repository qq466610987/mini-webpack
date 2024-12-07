export default class ChangeOutputPath {
  apply(hooks) {
    hooks.emitFile.tap("changeOutputPath", () => {
      console.log("___________________changeOutputPath");
    })
  }
}