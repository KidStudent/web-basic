export const componentInstall = (component, alias) => {
  component.install = (app) => {
    app.component(component.name, component);
    alias && (app.config.globalProperties[alias] = component);
  };
  return component;
};
